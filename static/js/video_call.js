class VideoCall {
    constructor() {
        this.localStream = null;
        this.peerConnection = null;
        this.websocket = null;
        this.isAudioMuted = false;
        this.isVideoMuted = false;
        this.currentChatId = null;
        this.isInitiator = false;
        this.config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    }

    async start(chatId) {
        this.currentChatId = chatId;
        this.isInitiator = true;
        document.querySelector('.video-call-overlay').classList.add('active');
        document.getElementById('callStatus').textContent = 'Подключение...';
        
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('localVideo').srcObject = this.localStream;
            
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            this.websocket = new WebSocket(`${protocol}//${window.location.host}/ws/call/chat_${chatId}/`);
            this.websocket.onopen = () => {
                document.getElementById('callStatus').textContent = 'Ожидание собеседника...';
                this.createPeerConnection();
            };
            this.websocket.onmessage = async (event) => {
                await this.handleSignal(JSON.parse(event.data));
            };
        } catch (error) {
            console.error('Ошибка:', error);
            document.getElementById('callStatus').textContent = 'Ошибка доступа к камере';
        }
    }

    createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.config);
        
        this.localStream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, this.localStream);
        });
        
        this.peerConnection.ontrack = (event) => {
            document.getElementById('remoteVideo').srcObject = event.streams[0];
            document.getElementById('callStatus').textContent = 'Подключено';
        };
        
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.websocket.send(JSON.stringify({
                    type: 'ice_candidate',
                    candidate: event.candidate
                }));
            }
        };
        
        this.peerConnection.createOffer().then(offer => {
            return this.peerConnection.setLocalDescription(offer);
        }).then(() => {
            this.websocket.send(JSON.stringify({
                type: 'offer',
                offer: this.peerConnection.localDescription
            }));
        });
    }

    async handleSignal(data) {
        if (data.type === 'user_joined') {
            if (this.isInitiator && this.peerConnection) {
                document.getElementById('callStatus').textContent = 'Собеседник присоединился...';
            }
        } else if (data.type === 'offer') {
            if (!this.peerConnection) this.createPeerConnection();
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.websocket.send(JSON.stringify({ type: 'answer', answer }));
        } else if (data.type === 'answer') {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.type === 'ice_candidate') {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
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
            this.localStream.getTracks().forEach(track => track.stop());
        }
        if (this.peerConnection) this.peerConnection.close();
        if (this.websocket) this.websocket.close();
        
        document.querySelector('.video-call-overlay').classList.remove('active');
        document.getElementById('localVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
    }
}

const videoCall = new VideoCall();

function startVideoCall() {
    const chatId = document.querySelector('.chat.selected')?.dataset.chatId;
    if (chatId) {
        videoCall.start(chatId);
    }
}
