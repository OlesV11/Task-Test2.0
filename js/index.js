const months = ["siječanj", "veljača", "ožujak", "travanj", "svibanj", "lipanj", "srpanj", "kolovoz", "rujan", "listopad", "studeni", "prosinac"];
const monthMin = ["", "", "", "", "", "", "", "", "", "", "", ""];
const days = ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"];
const daysMin = ["", "", "", "", "", "", ""];
const seasons = ["tél", "tavasz", "nyár", "ősz"];

function postDate(daysName, daysMinName, monthsName, monthsMinName, seasonsName) {
    const _counterLength = 60;
    for (let counter = 0; counter < _counterLength; counter++) {
        innerDate(counter, "date-");
        innerDate(counter, "date");
    }
    function innerDate(counter, dateType) {
        let newCounter;
        dateType === "date-" ? (newCounter = -counter) : (newCounter = counter);
        const _msInDay = 86400000,
            _localDate = new Date(Date.now() + newCounter * _msInDay),
            _day = _localDate.getDate(),
            _month = _localDate.getMonth() + 1,
            _year = _localDate.getFullYear();
        const dayDefault = addZero(_day),
            monthDefault = addZero(_month),
            defaultDate = dayDefault + "." + monthDefault + "." + _year;
        const dateClass = dateType + counter,
            nodeList = document.querySelectorAll("." + dateClass);
        for (let i = 0; i < nodeList.length; i++) {
            const dateFormat = nodeList[i].dataset.format;
            dateFormat !== undefined && dateFormat !== "" ? (nodeList[i].innerHTML = String(changeFormat(dayDefault, _month, _year, dateFormat, newCounter))) : (nodeList[i].innerHTML = defaultDate);
        }
    }
    function changeFormat(_day, _month, _year, format, counter) {
        let innerFormat = format;
        const testFormat = ["dd", "mm", "yyyy", "monthFull", "monthOnly", "year"],
            dateFormat = { dd: _day, mm: addZero(_month), yyyy: _year, monthFull: getMonthName(_month, monthsName, false), monthOnly: getMonthName(_month, monthsName, false, counter), year: getYearWithCounter(_year, counter) };
        for (let i = 0; i < testFormat.length; i++) {
            let string = testFormat[i];
            let regExp = new RegExp(string);
            innerFormat = innerFormat.replace(regExp, dateFormat[string]);
        }
        return innerFormat.split(" ").join(" ");
    }
    function getMonthName(_month, monthsName, bigFirstLetter, counter) {
        const monthCounter = !!counter ? counter : 0;
        let month;
        _month + monthCounter > 12 ? (month = monthCounter - (12 - _month)) : (month = _month + monthCounter);
        _month + monthCounter <= 0 ? (month = 12 + monthCounter + 1) : (month = _month + monthCounter);
        return changeFirstLetter(bigFirstLetter, monthsName[month - 1]);
    }
    function getYearWithCounter(year, counter) { return year + counter; }
    function addZero(numb) { return numb < 10 ? "0" + numb : numb; }
    function changeFirstLetter(isBig, str) { return isBig && str && str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str; }
}

if (document.body.classList.contains("ev-date")) {
    document.addEventListener("DOMContentLoaded", function () { postDate(days, daysMin, months, monthMin, seasons); });
}

function getValueQuest() {
    var quest = document.querySelectorAll(".quest"), answ = document.querySelectorAll(".answer-big"), arr = [];
    for (var i = 0; i < quest.length; i++) { arr.push({ q: quest[i].textContent, a: answ[i].textContent }); }
    const form = document.querySelector('#form');
    const input = form ? form.querySelector("input[name='question_answer']") : null;
    if (input) { input.value = JSON.stringify(arr); }
}

const coordinates = {
    getBlockCoordinates: (block) => { return { start: block.offsetTop, end: block.offsetTop + block.scrollHeight }; },
    screenDevice: () => { return { start: window.pageYOffset, end: window.pageYOffset + window.innerHeight }; }
};

const commentWrapper = document.querySelector(".comments__kma");
const commentWrite = document.querySelector(".comment-write");
const commentWriteSecond = document.querySelector(".comment-write-second");
const blockComment = document.querySelector(".comment-hide");
const blockCommentSecond = document.querySelector(".comment-hide-second");

if (commentWrapper && commentWrite && blockComment) {
    window.onscroll = () => {
        if (coordinates.getBlockCoordinates(commentWrite).start < coordinates.screenDevice().end) {
            window.onscroll = null;
            setTimeout(() => {
                commentWrite.style.maxHeight = "0";
                commentWrite.style.margin = "0";
                commentWrite.style.padding = "0";
                commentWrite.style.border = "none";
                commentWrapper.style.marginTop = "0";
                setTimeout(() => {
                    blockComment.classList.remove("comment-hide");
                    if (commentWriteSecond && blockCommentSecond) {
                        setTimeout(() => {
                            commentWriteSecond.style.maxHeight = "0";
                            commentWriteSecond.style.margin = "0";
                            commentWriteSecond.style.padding = "0";
                            commentWriteSecond.style.border = "none";
                            commentWriteSecond.style.display = "none";
                            commentWrapper.style.marginTop = "0";
                            setTimeout(() => { blockCommentSecond.classList.remove("comment-hide-second"); }, 300);
                        }, 2000);
                    }
                }, 300);
            }, 2000);
        }
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const commentDates = document.querySelectorAll(".comment-date");
    commentDates.forEach(function (elem) {
        const d = new Date();
        const num = parseInt(elem.dataset.num) || 0;
        d.setDate(d.getDate() - num);
        elem.textContent = d.toLocaleString().split(",")[0];
    });
    const likeCounts = document.querySelectorAll(".like-count");
    likeCounts.forEach(function (likeCount) {
        likeCount.addEventListener("click", function (event) {
            event.preventDefault();
            likeCount.classList.toggle("liked");
        });
    });
});

const sendCommentBtn = document.querySelector(".sendcomment");
if (sendCommentBtn) {
    sendCommentBtn.addEventListener("click", function () {
        const errors = document.querySelectorAll(".error");
        errors.forEach(err => err.style.display = "none");
        const nameInput = document.querySelector("#textboxname");
        const messageInput = document.querySelector("#textboxtext");
        const name = nameInput ? nameInput.value : "";
        const message = messageInput ? messageInput.value : "";
        if (name === "" && nameInput) {
            const nextElem = nameInput.nextElementSibling;
            if (nextElem && nextElem.classList.contains("error")) { nextElem.style.display = "block"; }
        } else if (message === "" && messageInput) {
            const nextElem = messageInput.nextElementSibling;
            if (nextElem && nextElem.classList.contains("error")) { nextElem.style.display = "block"; }
        } else {
            const comments = document.querySelector(".comments__kma");
            if (comments) {
                const today = new Date();
                let dd = today.getDate();
                let mm = today.getMonth() + 1;
                const yyyy = today.getFullYear();
                if (dd < 10) dd = "0" + dd;
                if (mm < 10) mm = "0" + mm;
                const todayStr = dd + "." + mm + "." + yyyy;
                const itemHTML = `<div class="mycomment"><div class="mycomment-img mycomment-img_pic"></div><div class="mycomment-info"><div class="mycomment-info__inner"><p class="mycomment-name">${name}</p><p class="mycomment-text">${message}</p><a href=""><div class="like-count like-count_added"><div class="icon__small icon__small_pic m-0"></div></div></a></div><p class="mycomment-bottom"><a href="">Me gusta</a><a href="">Responder</a><span class="comment-date">${todayStr}</span></p></div></div>`;
                comments.insertAdjacentHTML('afterbegin', itemHTML);
                if (nameInput) nameInput.value = "";
                if (messageInput) messageInput.value = "";
                errors.forEach(err => err.style.display = "none");
                const addComm = document.querySelector(".add-comm");
                if (addComm) { addComm.style.display = "none"; }
                const likeAdded = document.querySelector(".like-count_added");
                if (likeAdded) { likeAdded.addEventListener("click", function (event) { event.preventDefault(); likeAdded.classList.toggle("liked"); }); }
            }
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    let count = 0;
    let time = 600, intr;
    function start_timer() { intr = setInterval(tick, 1000); }
    function tick() {
        time = time - 1;
        let mins = Math.floor(time / 60);
        let secs = time - mins * 60;
        if (mins === 0 && secs === 0) { clearInterval(intr); }
        secs = secs >= 10 ? secs : "0" + secs;
        mins = mins >= 10 ? mins : "0" + mins;
        const minsElem = document.querySelector("#mins");
        const secsElem = document.querySelector("#secs");
        if (minsElem) minsElem.innerHTML = mins;
        if (secsElem) secsElem.innerHTML = secs;
    }
    const options = document.querySelectorAll(".quiz_option");
    const steps = document.querySelectorAll(".quiz_step");
    const nums = document.querySelectorAll(".quiz_num");
    const inputs = document.querySelectorAll(".quiz_form form input");
    const answ_span = document.querySelectorAll(".answer-big");
    let isClicked = false;
    let num = 0;
    options.forEach((option) => {
        option.addEventListener("click", () => {
            if (!isClicked) {
                isClicked = true;
                count++;
                option.classList.add("active");
                answ_span[num].innerHTML = option.textContent;
                num++;
                setTimeout(() => {
                    steps.forEach((step, _index) => {
                        if (_index === count) {
                            step.style.display = "block";
                            setTimeout(() => { step.classList.add("active"); }, 400);
                            if (count === 3) {
                                const quizNums = document.querySelector(".quiz_nums");
                                const quizTitle = document.querySelector(".quiz_title");
                                const orderTitle = document.querySelector(".order_title");
                                const quizWrap = document.querySelector(".quiz_wrap");
                                const prodImg = document.querySelector("#prod_img");
                                const scrollPoint = document.querySelector("#scroll_point");
                                if (quizNums) quizNums.style.display = "none";
                                if (quizTitle) quizTitle.style.display = "none";
                                if (orderTitle) orderTitle.style.display = "block";
                                if (quizWrap) quizWrap.style.height = "675px";
                                start_timer();
                                if (prodImg) prodImg.style.display = "block";
                                getValueQuest();
                                setTimeout(() => {
                                    if (prodImg) prodImg.classList.add("active");
                                    setTimeout(() => { if (scrollPoint) { scrollPoint.scrollIntoView({ block: "end", behavior: "smooth" }); } }, 200);
                                }, 400);
                            } else { nums[count].classList.add("active"); }
                        } else {
                            step.classList.remove("active");
                            setTimeout(() => { step.style.display = "none"; }, 400);
                        }
                    });
                    isClicked = false;
                }, 400);
            }
        });
    });
    inputs.forEach((input) => { input.addEventListener("focus", () => { input.classList.add("active"); }); });
});

const linkNav = document.querySelectorAll('[href^="#"]');
const V = 0.05;
for (let i = 0; i < linkNav.length; i++) {
    linkNav[i].addEventListener("click", function (e) {
        e.preventDefault();
        const w = window.pageYOffset;
        const hash = this.href.replace(/[^#]*(.*)/, "$1");
        const targetElem = document.querySelector(hash);
        if (targetElem) {
            const t = targetElem.getBoundingClientRect().top;
            let start = null;
            requestAnimationFrame(step);
            function step(time) {
                if (start === null) start = time;
                const progress = time - start;
                const r = t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t);
                window.scrollTo(0, r);
                if (r !== w + t) { requestAnimationFrame(step); } else { location.hash = hash; }
            }
        }
    }, false);
}

// Обробка відправки форми замовлення з Toast повідомленням та валідацією
document.addEventListener("DOMContentLoaded", function () {
    const orderForm = document.querySelector('.x_order_form');
    if (orderForm) {
        // Додаємо валідацію в реальному часі
        const nameInput = orderForm.querySelector('#name');
        const phoneInput = orderForm.querySelector('#phone');

        // Валідація імені
        if (nameInput) {
            nameInput.addEventListener('blur', function () {
                validateName(this);
            });
            nameInput.addEventListener('input', function () {
                if (this.value.length > 0) {
                    validateName(this);
                }
            });
        }

        // Валідація телефону
        if (phoneInput) {
            phoneInput.addEventListener('blur', function () {
                validatePhone(this);
            });
            phoneInput.addEventListener('input', function () {
                if (this.value.length > 0) {
                    validatePhone(this);
                }
            });
        }

        // Функція валідації імені
        function validateName(input) {
            const value = input.value.trim();
            const pattern = /^[A-Za-zΑ-Ωα-ωά-ώ\s]+$/;

            if (value.length === 0) {
                input.setCustomValidity('Εισαγάγετε το όνομά σας');
                return false;
            } else if (value.length < 2) {
                input.setCustomValidity('Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες');
                return false;
            } else if (!pattern.test(value)) {
                input.setCustomValidity('Εισαγάγετε μόνο γράμματα');
                return false;
            } else {
                input.setCustomValidity('');
                return true;
            }
        }

        // Функція валідації телефону
        function validatePhone(input) {
            const value = input.value.trim();
            const pattern = /^[0-9+\s\-()]+$/;

            if (value.length === 0) {
                input.setCustomValidity('Εισαγάγετε τον αριθμό τηλεφώνου σας');
                return false;
            } else if (value.length < 10) {
                input.setCustomValidity('Ο αριθμός τηλεφώνου πρέπει να έχει τουλάχιστον 10 χαρακτήρες');
                return false;
            } else if (!pattern.test(value)) {
                input.setCustomValidity('Εισαγάγετε έγκυρο αριθμό τηλεφώνου');
                return false;
            } else {
                input.setCustomValidity('');
                return true;
            }
        }

        // Обробка відправки форми
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Зупиняємо стандартну відправку

            // Перевіряємо валідність форми
            const isNameValid = nameInput ? validateName(nameInput) : true;
            const isPhoneValid = phoneInput ? validatePhone(phoneInput) : true;

            // Якщо форма не валідна - показуємо помилки та не відправляємо
            if (!orderForm.checkValidity() || !isNameValid || !isPhoneValid) {
                // Показуємо вбудовані повідомлення браузера
                orderForm.reportValidity();
                return false;
            }

            // Якщо все валідно - показуємо toast
            const toast = document.getElementById('toast');
            if (toast) {
                toast.classList.add('show');

                // Ховаємо toast через 3 секунди
                setTimeout(function () {
                    toast.classList.remove('show');
                }, 3000);
            }

            // Очищуємо форму після успішної відправки
            setTimeout(function () {
                orderForm.reset();
            }, 500);

            return false;
        });
    }
});

