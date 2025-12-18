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
        this.config = { 
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { 
                    urls: 'turn:95.163.227.170:3478',
                    username: 'riftuser',
                    credential: 'riftpass123'
                },
                { 
                    urls: 'turn:95.163.227.170:3478?transport=tcp',
                    username: 'riftuser',
                    credential: 'riftpass123'
                }
            ],
            iceCandidatePoolSize: 10
        };
    }

    async start(chatId, isInitiator) {
        if (isInitiator === undefined) isInitiator = true;
        this.currentChatId = chatId;
        this.isInitiator = isInitiator;
        this.pendingCandidates = [];
        document.querySelector('.video-call-overlay').classList.add('active');
        document.getElementById('callStatus').textContent = 'Подключение...';
        
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('localVideo').srcObject = this.localStream;
            
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = protocol + '//' + window.location.host + '/ws/call/chat_' + chatId + '/';
            this.websocket = new WebSocket(wsUrl);
            
            const self = this;
            this.websocket.onopen = function() {
                console.log('WebSocket opened');
                const status = isInitiator ? 'Ожидание собеседника...' : 'Подключение к звонку...';
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
            document.getElementById('callStatus').textContent = 'Ошибка доступа к камере';
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
                document.getElementById('callStatus').textContent = 'Подключено';
            } else if (self.peerConnection.connectionState === 'failed') {
                document.getElementById('callStatus').textContent = 'Ошибка соединения';
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
            document.getElementById('callStatus').textContent = 'Подключено';
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
            document.getElementById('callStatus').textContent = 'Собеседник присоединился...';
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
        if (this.localStream) {
            this.isAudioMuted = !this.isAudioMuted;
            this.localStream.getAudioTracks()[0].enabled = !this.isAudioMuted;
        }
    }

    toggleVideo() {
        if (this.localStream) {
            this.isVideoMuted = !this.isVideoMuted;
            this.localStream.getVideoTracks()[0].enabled = !this.isVideoMuted;
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
