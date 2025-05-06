class GnbMenu {
    constructor(jsonUrl) {
        this.gnbContainer = document.querySelector('ul.gnb'); // 메뉴 컨테이너
        this.jsonUrl = jsonUrl;          // JSON 데이터 경로
        this.isMobile = window.matchMedia("(max-width: 1024px)").matches; // 모바일 환경 감지
        this.init();                     // 초기화
    }

    // 초기화
    init() {
        this.loadMenuData().then((menuData) => {
            this.renderMenu(menuData.menu); // 메뉴 생성
            if (!this.isMobile) {          // 모바일 환경에서는 메뉴 이벤트를 바인딩하지 않음
                this.bindMenuEvents();     // 메뉴 이벤트 설정
            }
            this.setActiveMenuByUrl();     // 현재 URL 활성화
        }).catch((error) => {
            console.error('Failed to load menu data:', error);
        });
    }

    // JSON 데이터를 로드
    loadMenuData() {
        return fetch(this.jsonUrl)
            .then(response => response.json())
            .catch(error => console.error('Error loading menu data:', error));
    }

    // 메뉴 렌더링
    renderMenu(menuData) {
        const html = menuData.map(menu => {
            let submenuHTML = '';
            if (menu.items) {
                submenuHTML = `
                    <div class="gnb__submenu">
                        <ul class="sec-depth">
                            ${menu.items.map(sub => {
                                let thirdLevelHTML = '';
                                if (sub.items) {
                                    thirdLevelHTML = `
                                        <ul class="third-depth">
                                            ${sub.items.map(third => `
                                                <li class="third-depth__item">
                                                    <a href="${third.link}">${third.title}</a>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    `;
                                }

                                const subMenuTitle = sub.items ?
                                    `<span>${sub.title}</span>` :
                                    `<a href="${sub.link}">${sub.title}</a>`;

                                return `
                                    <li class="sec-depth__item">
                                        ${subMenuTitle}
                                        ${thirdLevelHTML}
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                    </div>
                `;
            }

            return `
                <li class="gnb__item">
                    <a href="${menu.link}">${menu.title}</a>
                    ${submenuHTML}
                </li>
            `;
        }).join('');

        this.gnbContainer.innerHTML = html;
    }

    bindMenuEvents() {
        this.gnbContainer.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const item = link.closest('.gnb__item');
            const submenu = item.querySelector('.gnb__submenu');

            // 자식 메뉴가 있을 경우 토글
            if (submenu && !link.closest('.sec-depth__item, .third-depth__item')) {
                e.preventDefault(); // 기본 링크 이동 방지
                this.toggleMenu(item, submenu);
            } else {
                this.closeAllMenusExceptActive();
            }
        });

        this.gnbContainer.addEventListener('mouseleave', (e) => {
            const submenu = e.target.closest('.gnb__submenu');
            if (submenu) {
                const item = submenu.closest('.gnb__item');
                submenu.style.display = 'none';
                item.classList.remove('active');
                this.toggleHeaderClass();
            }
        });

        this.handleScrollEvent();
    }

    handleScrollEvent() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;

            const headerBg = document.querySelector('.header-bg');
            if (scrollTop > 890) {
                headerBg.classList.add('bg-on');
            } else {
                headerBg.classList.remove('bg-on');
            }
        });
    }

    closeAllMenusExceptActive() {
        const activeItems = this.gnbContainer.querySelectorAll('.gnb__item.active');
        activeItems.forEach(item => item.classList.remove('active'));

        const submenus = this.gnbContainer.querySelectorAll('.gnb__submenu');
        submenus.forEach(submenu => submenu.style.display = 'none');

        this.setActiveMenuByUrl();
    }

    setActiveMenuByUrl() {
        const currentUrl = window.location.href;
        const links = this.gnbContainer.querySelectorAll('.gnb__item > a');

        links.forEach(link => {
            if (link.href === currentUrl) {
                const item = link.closest('.gnb__item');
                item.classList.add('active');
                const submenu = item.querySelector('.gnb__submenu');
                if (submenu) submenu.style.display = 'block';
            }
        });
    }

    toggleMenu(item, submenu) {
        const isOpen = submenu.style.display === 'block';

        this.toggleHeaderClass();

        if (isOpen) {
            submenu.style.display = 'none';
            item.classList.remove('active');
            this.setActiveMenuByUrl();
        } else {
            const allSubmenus = this.gnbContainer.querySelectorAll('.gnb__submenu');
            allSubmenus.forEach(submenu => submenu.style.display = 'none');

            const allItems = this.gnbContainer.querySelectorAll('.gnb__item');
            allItems.forEach(item => item.classList.remove('active'));

            submenu.style.display = 'block';
            item.classList.add('active');
        }
    }

    toggleHeaderClass() {
        setTimeout(() => {
            const hasOpenMenu = this.gnbContainer.querySelectorAll('.gnb__submenu[style="display: block;"]').length > 0;
            const header = document.querySelector('header');
            if (hasOpenMenu) {
                header.classList.add('on');
            } else {
                header.classList.remove('on');
            }
        }, 50);
    }
}

new GnbMenu('../data/menu.json');  // 메뉴 데이터를 로드

//mobile menu open
class MobileGnbMenu {
    constructor() {
        this.menuOpenButton = document.querySelector('.menu-open');
        this.menuCloseButton = document.querySelector('.mo-gnb .close');
        this.gnb = document.querySelector('.mo-gnb');
        this.body = document.body;

        this.init();
    }

    // 초기화 함수 - 이벤트 바인딩
    init() {
        this.menuOpenButton.addEventListener('click', () => this.openMenu());
        this.menuCloseButton.addEventListener('click', () => this.closeMenu());
    }

    // 메뉴 열기 함수
    openMenu() {
        this.gnb.classList.add('mo-gnb-open');
        this.gnb.classList.remove('mo-gnb-close');
        this.body.classList.add('overflow-hidden');
    }

    // 메뉴 닫기 함수
    closeMenu() {
        this.gnb.classList.remove('mo-gnb-open');
        this.gnb.classList.add('mo-gnb-close');
        this.body.classList.remove('overflow-hidden');
    }
}

// new MobileGnbMenu();


// // accordion
// class Accordion {
//     constructor(selector, options = {}) {
//         this.$accordion = $(selector);
//         this.type = options.type || 'single';
//         this.animationMode =
//             options.animationMode !== undefined ? options.animationMode : true;
//         this.activeIndices = options.defaultActiveIndices || [];

//         this.init();
//     }

//     // 초기화 함수
//     init() {
//         this.$accordion.on('click', '[data-js="accordion__btn"]', (event) => {
//             const $item = $(event.currentTarget).closest('.accordion__item');
//             const index = $item.data('index');
//             this.toggleAccordion(index);
//         });

//         this.updateAccordion();
//     }

//     // 아코디언 토글 함수
//     toggleAccordion(index) {
//         const isActive = this.activeIndices.includes(index);

//         if (this.type === 'single') {
//             this.activeIndices = isActive ? [] : [index];
//         } else {
//             if (isActive) {
//                 this.activeIndices = this.activeIndices.filter(
//                     (i) => i !== index,
//                 );
//             } else {
//                 this.activeIndices.push(index);
//             }
//         }

//         this.updateAccordion();
//     }

//     // 아코디언 상태 업데이트 함수
//     updateAccordion() {
//         this.$accordion.find('.accordion__item').each((_, item) => {
//             const $item = $(item);
//             const index = $item.data('index');
//             const isOpen = this.activeIndices.includes(index);

//             if (isOpen) {
//                 if (this.animationMode) {
//                     $item.find('.accordion__panel').stop().slideDown();
//                 } else {
//                     $item.find('.accordion__panel').show();
//                 }
//                 $item.addClass('is-active');
//             } else {
//                 if (this.animationMode) {
//                     $item.find('.accordion__panel').stop().slideUp();
//                 } else {
//                     $item.find('.accordion__panel').hide();
//                 }
//                 $item.removeClass('is-active');
//             }
//         });
//     }
// }

// accordion
class Accordion {
    constructor(selector, options = {}) {
        this.accordion = document.querySelector(selector);
        this.type = options.type || 'single';
        this.animationMode = options.animationMode !== undefined ? options.animationMode : true;
        this.activeIndices = options.defaultActiveIndices || [];

        this.init();
    }

    // 초기화 함수
    init() {
        const buttons = this.accordion.querySelectorAll('[data-js="accordion__btn"]');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const item = event.currentTarget.closest('.accordion__item');
                const index = item.dataset.index;
                this.toggleAccordion(index);
            });
        });

        this.updateAccordion();
    }

    // 아코디언 토글 함수
    toggleAccordion(index) {
        const isActive = this.activeIndices.includes(index);

        if (this.type === 'single') {
            this.activeIndices = isActive ? [] : [index];
        } else {
            if (isActive) {
                this.activeIndices = this.activeIndices.filter(i => i !== index);
            } else {
                this.activeIndices.push(index);
            }
        }

        this.updateAccordion();
    }

    // 아코디언 상태 업데이트 함수
    updateAccordion() {
        const items = this.accordion.querySelectorAll('.accordion__item');
        items.forEach(item => {
            const index = item.dataset.index;
            const isOpen = this.activeIndices.includes(index);
            const panel = item.querySelector('.accordion__panel');

            if (isOpen) {
                if (this.animationMode) {
                    panel.style.display = 'block'; // 애니메이션 없이 바로 보여주기
                    panel.style.maxHeight = panel.scrollHeight + 'px'; // 애니메이션처럼 최대 높이로 확장
                    item.classList.add('is-active');
                } else {
                    panel.style.display = 'block';
                    item.classList.add('is-active');
                }
            } else {
                if (this.animationMode) {
                    panel.style.display = 'none';
                    panel.style.maxHeight = 0;
                    item.classList.remove('is-active');
                } else {
                    panel.style.display = 'none';
                    item.classList.remove('is-active');
                }
            }
        });
    }
}


// tab
class Tab {
    constructor(selector, options = {}) {
        this.tabsContainer = document.querySelector(selector);
        if (!this.tabsContainer) {
            console.error(`Tab: '${selector}' 요소를 찾을 수 없습니다.`);
            return;
        }

        this.activeIndex = options.defaultActiveIndex || 0;
        this.buttons = Array.from(this.tabsContainer.querySelectorAll('[data-js="tab__btns"]'));
        this.panels = Array.from(this.tabsContainer.querySelectorAll('.tab__panels__box'));

        this.init();
    }

    init() {
        if (this.buttons.length === 0 || this.panels.length === 0) {
            console.error("Tab: 버튼 또는 패널이 존재하지 않습니다.");
            return;
        }

        this.buttons.forEach((button, index) => {
            button.addEventListener('click', () => this.activateTab(index));
        });

        this.updateTabs();
    }

    activateTab(index) {
        index = Number(index); // index를 숫자로 변환하여 비교
        if (this.activeIndex === index) return; // 동일한 탭 클릭 시 무시

        this.activeIndex = index;
        this.updateTabs();
    }

    updateTabs() {
        this.buttons.forEach((button, index) => {
            button.classList.toggle('active', index === this.activeIndex);
        });

        this.panels.forEach((panel, index) => {
            if (index === this.activeIndex) {
                panel.style.display = 'block';
                panel.classList.add('active');
            } else {
                panel.style.display = 'none';
                panel.classList.remove('active');
            }
        });
    }
}

// Popup Class
class Popup {
    constructor(id) {
        this.$popup = $(`#${id}`);
        if (this.$popup.length === 0) {
            console.warn(`Popup with ID "${id}" not found.`);
            return;
        }

        this.$dimmed = this.$popup.find('.dimd');
        this.$body = $('body');
        this.$closeButton = this.$popup.find('button.alert__close, button.modal--close, button.btn-cancel, button.close');
        this.$closeDayButton = this.$popup.find('button.close-day');

        this.$dimmed.on('click', () => this.close());
        this.$closeButton.on('click', () => this.close());
        this.$closeDayButton.on('click', () => this.closeForDay());
    }

    open() {
        if (this.isClosedForDay()) return;
        this.$popup.show();
        this.$dimmed.show();
        this.$body.addClass('overflow-hidden');
    }

    close() {
        this.$popup.hide();
        this.$dimmed.hide();
        this.$body.removeClass('overflow-hidden');
    }

    closeForDay() {
        const id = this.$popup.attr('id');
        localStorage.setItem(`popup_closed_${id}`, Date.now());
        this.close();
    }

    isClosedForDay() {
        const id = this.$popup.attr('id');
        const closedTime = localStorage.getItem(`popup_closed_${id}`);
        if (!closedTime) return false;
        const oneDay = 24 * 60 * 60 * 1000;
        return Date.now() - closedTime < oneDay;
    }
}

// 입력 필드 삭제 버튼 기능
class InputWithClearAndCharCount {
    constructor(input) {
        this.input = input;
        this.clearBtn = input.closest('.input-wrap__input')?.querySelector('.btn-clear');
        this.charCountDisplay = input.closest('.input-basic, .text-wrap')?.querySelector('.current-count');

        // clearBtn이 없는 경우에는 바로 종료하지 않고 진행할 수 있도록 수정
        if (!this.clearBtn && !this.charCountDisplay) return;

        this.init();
    }

    init() {
        // input이나 textarea에서의 이벤트 처리
        this.input.addEventListener('input', () => {
            this.toggleClearButton();
            if (this.charCountDisplay) {
                this.updateCharCount();
            }
        });

        // clear 버튼 클릭 시 입력 필드 비우기
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearInputField());
        }

        this.toggleClearButton();

        if (this.charCountDisplay) {
            this.updateCharCount();
        }
    }

    toggleClearButton() {
        // 입력 필드에 값이 있으면 삭제 버튼을 보이고 없으면 숨김
        if (this.clearBtn) {
            this.clearBtn.style.display = this.input.value.trim() ? 'block' : 'none';
        }
    }

    clearInputField() {
        // 입력 필드 비우기
        this.input.value = '';
        this.toggleClearButton();
        if (this.charCountDisplay) {
            this.updateCharCount();
        }
    }

    updateCharCount() {
        // 입력된 문자 수 갱신
        const currentCount = this.input.value.length;
        if (this.charCountDisplay) {
            this.charCountDisplay.textContent = currentCount;
        }
    }
}

document.querySelectorAll('.input-field').forEach(input => new InputWithClearAndCharCount(input));
document.querySelectorAll('.textarea-field').forEach(input => new InputWithClearAndCharCount(input));

class DropDown {
    constructor(dropDownElement) {
        this.dropDown = dropDownElement;
        this.dropDownSelect = this.dropDown.querySelector('[data-js="select"]');
        this.dropDownItems = this.dropDown.querySelectorAll('[data-js="item"]');
        this.selected = false; // 선택 여부를 추적하는 변수

        this.init();
    }

    init() {
        // 드롭다운을 클릭하면 열고 닫음
        this.dropDownSelect.addEventListener('click', (event) => {
            const currentDropDown = event.currentTarget.closest('.drop-down');
            this.selected = false; // 드롭다운이 열릴 때 초기화

            // 모든 드롭다운을 닫음
            document.querySelectorAll('.drop-down').forEach(dropDown => {
                if (dropDown !== currentDropDown) {
                    dropDown.classList.remove('open');
                }
            });

            // 현재 드롭다운을 열거나 닫음
            currentDropDown.classList.toggle('open');
        });

        // 리스트 항목을 클릭하면 선택 처리
        this.dropDownItems.forEach(item => {
            item.addEventListener('click', (event) => {
                const selectedText = event.currentTarget.textContent;

                this.dropDownSelect.textContent = selectedText;
                this.dropDownItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.dropDown.classList.remove('open');

                // 선택된 상태로 설정
                this.selected = true; // 선택된 상태로 업데이트
                this.dropDown.classList.remove('err'); // 선택 시 에러 클래스 제거
            });
        });
    }
}
// 여러 개의 DropDown 인스턴스를 처리하기 위해 각각 초기화
document.querySelectorAll('.drop-down').forEach(dropDownElement => { new DropDown(dropDownElement); });

// 상단으로 이동하기
class GoTopButton {
    constructor(selector, scrollOffset = 100) {
        this.button = document.querySelector(selector);
        this.scrollOffset = scrollOffset;
        if (this.button) {  // 버튼이 존재할 때만 이벤트 리스너 추가
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => this.button.style.display = (window.scrollY > this.scrollOffset) ? 'block' : 'none');
        this.button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

const goTopButton = new GoTopButton('.go-top');

//파일 첨부 기능
class FileUpload {
    constructor(selector) {
        // title에서 동적으로 ID를 생성하여 sanitize 처리
        const sanitizedTitle = selector.getAttribute('id').replace('fileInput-', '');
        this.fileInput = document.getElementById(`fileInput-${sanitizedTitle}`);
        this.fileNameDisplay = document.getElementById(`file-name-${sanitizedTitle}`);
        this.deleteButton = document.getElementById(`delete-btn-${sanitizedTitle}`);
        this.selectButton = this.fileInput.closest('.file-wrap').querySelector('.btn-select');

        this.init();
    }

    init() {
        // 파일 입력 필드 변경 시 파일 이름 업데이트 및 삭제 버튼 표시
        this.fileInput.addEventListener('change', () => this.updateFileName());

        // 삭제 버튼 클릭 시 파일 삭제
        this.deleteButton.addEventListener('click', () => this.deleteFile());
    }

    // 파일 이름 업데이트 및 삭제 버튼 표시
    updateFileName() {
        const fileName = this.fileInput.files[0] ? this.fileInput.files[0].name : '파일을 선택하세요';
        this.fileNameDisplay.textContent = fileName;
        this.deleteButton.style.display = 'inline-block';
        this.selectButton.disabled = true;
    }

    // 파일 삭제
    deleteFile() {
        this.fileInput.value = '';  // 파일 입력 필드 초기화
        this.fileNameDisplay.textContent = '파일을 선택하세요';
        this.selectButton.disabled = false;
        this.deleteButton.style.display = 'none';  // 삭제 버튼 숨김
    }
}

// 모든 파일 업로드 필드에 대해 초기화
document.querySelectorAll('.file-input').forEach(input => new FileUpload(input));

