class GPopup extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'popup-wrapper');

        const style = document.createElement('style');
        style.textContent = `
             .popup-wrapper {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #ccc;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
                z-index: 1000;
                display: none;
                width: 300px; /* Default width */
                height: 200px; /* Default height */
                transition: all 0.20s ease-in-out; /* Add a transition for smooth resizing */
            }
            .popup-wrapper.show {
                display: block;
                padding-top: 70px;
                width: 145px; /* Increase width when shown */
                height: 95px; /* Increase height when shown */
                text-align: center;
                background: linear-gradient(45deg, #d060d0 0%, #c698cf 65%, #cdb4db 100%); /* Change background color to coral */
            }
            .popup-wrapper .close-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
            }
        `;
        
        wrapper.innerHTML = `
            <button class="close-button">&times;</button>
            <div class="content">
                <slot></slot>
            </div>
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);

        const closeButton = wrapper.querySelector('.close-button');
        closeButton.addEventListener('click', () => this.hide());
    }

    show() {
        const wrapper = this.shadowRoot.querySelector('.popup-wrapper');
        wrapper.classList.add('show');
    }

    hide() {
        const wrapper = this.shadowRoot.querySelector('.popup-wrapper');
        wrapper.classList.remove('show');
    }
}

customElements.define('g-popup', GPopup);