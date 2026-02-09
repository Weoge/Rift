class VideoCall {
    constructor() {
        this.localStream = null;
        this.peerConnection = null;
        this.websocket = null;
        this.isAudioMuted = false;
        this.isVideoMuted = false;
        this.currentChatId = null;
        this.isInitiator = false;
        this.pendingCandidates = [];
        this.config = null;
    }

    async loadTurnConfig() {
        try {
            const response = await fetch('/app/turn/config/');
            const data = await response.json();
            this.config = {
                iceServers: data.iceServers,
                iceCandidatePoolSize: 10
            };
        } catch (error) {
            console.error('Failed to load TURN config:', error);
            this.config = {
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
                iceCandidatePoolSize: 10
            };
        }
    }

    async start(chatId, isInitiator) {
        if (isInitiator === undefined) isInitiator = true;
        this.currentChatId = chatId;
        this.isInitiator = isInitiator;
        this.pendingCandidates = [];
        
        const overlay = document.querySelector('.video-call-overlay');
        const statusEl = document.getElementById('callStatus');
        const localVideo = document.getElementById('localVideo');
        
        if (!overlay || !statusEl || !localVideo) {
            console.error('Video call elements not found');
            return;
        }
        
        const chat_content = document.getElementById('chat_content');
        if (chat_content) {
            chat_content.style.top = 'auto';
            chat_content.style.height = 'calc(100% - 310px)';
            const messages = chat_content.querySelector('messages');
            if (messages) {
                messages.style.height = 'calc(100vh - 205px - 310px)';
            }
        }
        
        overlay.classList.add('active');
        statusEl.textContent = `${gettext("Подключение...")}`;
        
        if (!this.config) {
            await this.loadTurnConfig();
        }
        
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideo.srcObject = this.localStream;
            
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = protocol + '//' + window.location.host + '/ws/call/chat_' + chatId + '/';
            this.websocket = new WebSocket(wsUrl);
            
            const self = this;
            this.websocket.onopen = function() {
                console.log('WebSocket opened');
                const status = isInitiator ? `${gettext("Ожидание собеседника...")}` : `${gettext("Подключение к звонку...")}`;
                document.getElementById('callStatus').textContent = status;
                self.createPeerConnection();
            };
            
            this.websocket.onmessage = async function(event) {
                await self.handleSignal(JSON.parse(event.data));
            };
            
            this.websocket.onerror = function(error) {
                console.error('WebSocket error:', error);
            };
            
            this.websocket.onclose = function() {
                console.log('WebSocket closed');
            };
        } catch (error) {
            console.error('Ошибка:', error);
            if (statusEl) statusEl.textContent = `${gettext("Ошибка доступа к камере")}`;
        }
    }

    createPeerConnection() {
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        
        this.peerConnection = new RTCPeerConnection(this.config);
        
        const self = this;
        this.peerConnection.onconnectionstatechange = function() {
            console.log('Connection state:', self.peerConnection.connectionState);
            if (self.peerConnection.connectionState === 'connected') {
                document.getElementById('callStatus').textContent = `${gettext("Подключено")}`;
            } else if (self.peerConnection.connectionState === 'failed') {
                document.getElementById('callStatus').textContent = `${gettext("Ошибка соединения")}`;
            }
        };
        
        this.peerConnection.oniceconnectionstatechange = function() {
            console.log('ICE connection state:', self.peerConnection.iceConnectionState);
        };
        
        this.peerConnection.onicegatheringstatechange = function() {
            console.log('ICE gathering state:', self.peerConnection.iceGatheringState);
        };
        
        this.localStream.getTracks().forEach(function(track) {
            console.log('Adding local track:', track.kind);
            self.peerConnection.addTrack(track, self.localStream);
        });
        
        this.peerConnection.ontrack = function(event) {
            console.log('Remote track received:', event.track.kind);
            document.getElementById('remoteVideo').srcObject = event.streams[0];
            document.getElementById('callStatus').textContent = `${gettext("Подключено")}`;
        };
        
        this.peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                console.log('Sending ICE candidate:', event.candidate.type);
                self.websocket.send(JSON.stringify({
                    type: 'ice_candidate',
                    candidate: event.candidate
                }));
            }
        };
    }

    async handleSignal(data) {
        console.log('Received signal:', data.type);
        
        if (data.type === 'user_joined') {
            document.getElementById('callStatus').textContent = `${gettext("Собеседник присоединился...")}`;
            if (this.isInitiator) {
                console.log('Creating offer...');
                const offer = await this.peerConnection.createOffer();
                await this.peerConnection.setLocalDescription(offer);
                console.log('Sending offer');
                this.websocket.send(JSON.stringify({ type: 'offer', offer: offer }));
            }
        } else if (data.type === 'offer') {
            console.log('Received offer, creating answer...');
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            
            for (let i = 0; i < this.pendingCandidates.length; i++) {
                await this.peerConnection.addIceCandidate(this.pendingCandidates[i]);
            }
            this.pendingCandidates = [];
            
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            console.log('Sending answer');
            this.websocket.send(JSON.stringify({ type: 'answer', answer: answer }));
        } else if (data.type === 'answer') {
            console.log('Received answer');
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            
            for (let i = 0; i < this.pendingCandidates.length; i++) {
                await this.peerConnection.addIceCandidate(this.pendingCandidates[i]);
            }
            this.pendingCandidates = [];
        } else if (data.type === 'ice_candidate') {
            console.log('Received ICE candidate');
            const candidate = new RTCIceCandidate(data.candidate);
            if (this.peerConnection.remoteDescription) {
                await this.peerConnection.addIceCandidate(candidate);
            } else {
                this.pendingCandidates.push(candidate);
            }
        } else if (data.type === 'user_left') {
            this.end();
        }
    }

    toggleAudio() {
        const toggleAudio = document.getElementById('toggleAudio');
        if (this.localStream) {
            this.isAudioMuted = !this.isAudioMuted;
            this.localStream.getAudioTracks()[0].enabled = !this.isAudioMuted;
            toggleAudio.innerHTML = this.isAudioMuted ?
            `<svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 9.4V5C15 3.34315 13.6569 2 12 2C10.8224 2 9.80325 2.67852 9.3122 3.66593M12 19V22M12 19C8.13401 19 5 15.866 5 12V10M12 19C15.866 19 19 15.866 19 12V10M8 22H16M2 2L22 22M12 15C10.3431 15 9 13.6569 9 12V9L14.1226 14.12C13.5796 14.6637 12.8291 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` :
            `<svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        }
    }

    toggleVideo() {
        const toggleVideo = document.getElementById('toggleVideo');
        if (this.localStream) {
            this.isVideoMuted = !this.isVideoMuted;
            this.localStream.getVideoTracks()[0].enabled = !this.isVideoMuted;
            toggleVideo.innerHTML = this.isVideoMuted ? 
            `<svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5C3.34315 5 2 6.34315 2 8V16C2 17.6569 3.34315 19 5 19H14C15.3527 19 16.4962 18.1048 16.8705 16.8745M17 12L20.6343 8.36569C21.0627 7.93731 21.2769 7.72312 21.4608 7.70865C21.6203 7.69609 21.7763 7.76068 21.8802 7.88238C22 8.02265 22 8.32556 22 8.93137V15.0686C22 15.6744 22 15.9774 21.8802 16.1176C21.7763 16.2393 21.6203 16.3039 21.4608 16.2914C21.2769 16.2769 21.0627 16.0627 20.6343 15.6343L17 12ZM17 12V9.8C17 8.11984 17 7.27976 16.673 6.63803C16.3854 6.07354 15.9265 5.6146 15.362 5.32698C14.7202 5 13.8802 5 12.2 5H9.5M2 2L22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` : 
            `<svg class="icon" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 8.93137C22 8.32555 22 8.02265 21.8802 7.88238C21.7763 7.76068 21.6203 7.69609 21.4608 7.70865C21.2769 7.72312 21.0627 7.93731 20.6343 8.36569L17 12L20.6343 15.6343C21.0627 16.0627 21.2769 16.2769 21.4608 16.2914C21.6203 16.3039 21.7763 16.2393 21.8802 16.1176C22 15.9774 22 15.6744 22 15.0686V8.93137Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 9.8C2 8.11984 2 7.27976 2.32698 6.63803C2.6146 6.07354 3.07354 5.6146 3.63803 5.32698C4.27976 5 5.11984 5 6.8 5H12.2C13.8802 5 14.7202 5 15.362 5.32698C15.9265 5.6146 16.3854 6.07354 16.673 6.63803C17 7.27976 17 8.11984 17 9.8V14.2C17 15.8802 17 16.7202 16.673 17.362C16.3854 17.9265 15.9265 18.3854 15.362 18.673C14.7202 19 13.8802 19 12.2 19H6.8C5.11984 19 4.27976 19 3.63803 18.673C3.07354 18.3854 2.6146 17.9265 2.32698 17.362C2 16.7202 2 15.8802 2 14.2V9.8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        }
    }

    end() {
        if (this.localStream) {
            const tracks = this.localStream.getTracks();
            for (let i = 0; i < tracks.length; i++) {
                tracks[i].stop();
            }
        }
        if (this.peerConnection) this.peerConnection.close();
        if (this.websocket) this.websocket.close();
        
        this.pendingCandidates = [];
        document.querySelector('.video-call-overlay').classList.remove('active');
        document.getElementById('localVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
    }
}

const videoCall = new VideoCall();

function startVideoCall() {
    const context_menu = document.querySelector(".context_menu");
    context_menu.classList.toggle("active")
    const selectedChat = document.querySelector('.chat.selected');
    if (selectedChat) {
        const chatId = selectedChat.dataset.chatId;
        fetch('/app/call/' + chatId + '/initiate/')
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.status === 'success') {
                    videoCall.start(chatId, true);
                }
            });
    }
}

function answerCall(chatId) {
    videoCall.start(chatId, false);
}

function deniceCall() {
    videoCall.end();
}
