let messageVirtualization = {
    container: null,
    messages: [],
    visibleRange: { start: 0, end: 50 },
    itemHeight: 100,
    
    init(container, messages) {
        this.container = container;
        this.messages = messages;
        this.render();
        this.setupScrollListener();
    },
    
    render() {
        if (!this.container || this.messages.length === 0) return;
        
        const fragment = document.createDocumentFragment();
        const end = Math.min(this.visibleRange.end, this.messages.length);
        
        for (let i = this.visibleRange.start; i < end; i++) {
            const messageEl = createMessageElement(this.messages[i]);
            fragment.appendChild(messageEl);
        }
        
        this.container.appendChild(fragment);
    },
    
    setupScrollListener() {
        if (!this.container) return;
        
        let ticking = false;
        this.container.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateVisibleRange();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },
    
    updateVisibleRange() {
        const scrollTop = this.container.scrollTop;
        const containerHeight = this.container.clientHeight;
        
        const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - 10);
        const end = Math.min(this.messages.length, Math.ceil((scrollTop + containerHeight) / this.itemHeight) + 10);
        
        if (start !== this.visibleRange.start || end !== this.visibleRange.end) {
            this.visibleRange = { start, end };
        }
    },
    
    addMessage(message) {
        this.messages.push(message);
        if (this.messages.length <= this.visibleRange.end) {
            const messageEl = createMessageElement(message);
            this.container.appendChild(messageEl);
        }
    }
};
