const section = document.querySelectorAll(".page_con");
console.log(section);

/* 변수 */
// [현재 카테고리의 인덱스, 현재 게시글의 각 인덱스] =[각각 카운트]

let [categoryIndex, currentItem] = [0, 0];

const imageURL = [];

// 로컬에 데이터 존재 안 하면 undefined 이므로 || 뒤의 0 을 할당
let listId = JSON.parse(localStorage.getItem("data"))?.length ?? 0;

/* ---------------데이터베이스---------- */
// 로컬에 이미 존재하는 데이터를 가져와서 database 변수에 할당
// 만일 로컬에 데이터가 없다면 undefined 이므로 || 연산에 의해 [] 빈배열 할당
// || 연산자는 좌측값이 falsy 로 인식되면 뒤에 값을 평가한다.
const localData = JSON.parse(localStorage.getItem("data")) || [];
const loginUsername = JSON.parse(sessionStorage.getItem("user"));
const database = localData;

const nickname =
  JSON.parse(sessionStorage.getItem("user"))?.username ||
  { username: wWriter.value }.username;
wWriter.value = nickname;

/* 데이터베이스에 데이터를 전송하는 함수 */
function storePushFunc() {
  const data = {
    id: listId++,
    title: wUserInput.value,
    content: wContent.value,
    writer: wWriter.value,
    date: new Date().toLocaleString(),
    image: imageURL[0],
    count: 0,
  };

  database.push(data);
  reload();

  [wUserInput.value, wContent.value, wWriter.value] = ["", "", ""];
}

/* 로그인 상태 관리 */
const state = (() => {
  function loginHandler(isLogin = false) {
    const loginState = isLogin;
    return loginState;
  }
  return { loginHandler };
})();

/* 메뉴(카테고리) 클릭 시 포커스 유지하는 함수 */
function menuFocus(categoryIndex) {
  categoriesLi.forEach((_, i) => {
    categoriesLi[i].classList.remove("menu_on");
    if (i === categoryIndex) {categoriesLi[i].classList.add("menu_on")};
  });
}
menuFocus(categoryIndex);

/* 카테고리 클릭 시 페이지 이동 함수를 호출하는 이벤트 등록 */
categories.addEventListener("click", (e) => {
  pageChange(e.target);
});

// 페이지를 처리하는 함수
const pageChange = (category) => {
  const menu = category.dataset.id;
  switch (menu) {
    case "home":
      console.log("home");
      categoryIndex = 0;
      home();
      menuFocus(categoryIndex);
      break;
    case "board":
      console.log("board");
      categoryIndex = 1;
      board();
      menuFocus(categoryIndex);
      break;
    case "writing":
      console.log("writing");
      categoryIndex = 2;
      writing();
      menuFocus(categoryIndex);
      break;
    default:
      console.log("해당없음");
  }
};

/* 홈 페이지 */
const home = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
home();

/* 게시판 페이지 */
const board = () => {
  console.log(section[1].offsetTop)
  window.scrollTo({ top: section[1].offsetTop - 40, behavior: "smooth" });
};

function accessControl() {
  // 유저의 로그인 데이터가 존재하지 않는다면 로그인하라는 문구와 동시에 로그인 모달창이 뜨며, 홈으로 이동
  const isLogin = JSON.parse(sessionStorage.getItem("user"))?.isLogin || false;
  if (!isLogin) {
    alert("로그인 하세요");
    homeShift();
    return loginToggle();
  }
}

/* 글쓰기 페이지 */
const writing = () => {
  window.scrollTo({ top: section[2].offsetTop - 30, behavior: "smooth" });
  accessControl(); // 접근 권한를 통제하는 함수(가짜 미들웨어 역할)
};

/* 글수정 페이지 */
const update = () => {
  window.scrollTo({ top: section[4].offsetTop - 30, behavior: "smooth" });
  accessControl(); // 접근 권한를 통제하는 함수(가짜 미들웨어 역할)
};

/*  게시판으로 이동 */
document.querySelectorAll(".move_btn").forEach((moveBtn) => {
  moveBtn.addEventListener("click", boardShift);
});

/* ---------------기능추가------------ */

/* 글 등록 */
// 글작성 페이지에서 등록 버튼을 클릭하면 입력한 데이터를 데이터베이스에 추가한다.
wRegistBtn.addEventListener("click", () => {
  storePushFunc();
  boardShift();
});

/* 게시판 렌더 함수 */
const render = () => {
  let listHTML = "";
  listHTML += `<tr><th>글번호</th><th>제목</th><th>작성자</th><th>조회수</th><th>작성일자</th></tr>
  `;
  for (let i = database.length - 1; i >= 0; i--) {
    listHTML += `
      <tr onclick="detail(${i})">
          <td>${1 * database[i].id + 1}</td>
          <td>${database[i].title}</td>
          <td>${database[i].writer}</td>
          <td><span>${database[i].count}<span></td>
          <td>${database[i].date}</td>
      </tr>
    `;
  }
  document.getElementById("list_table").innerHTML = listHTML;
};

/* 상세내용 페이지 렌더링 함수 */
const detail = (i) => {
  currentItem = i;
  database[i].count++;
  window.scrollTo({ top: section[3].offsetTop, behavior: "smooth" });

  reload();
  const detailHTML = `
      <p><span>글번호</span>${1 * database[i].id + 1}</p>
      <p><span>제목</span>${database[i].title}</p>
      <p><span>조회수</span>${database[i].count}</p>
      <p><span>작성자</span>${database[i].writer} </p>
      <p><span>작성일시</span>${database[i].date}</p>
      <p><span>내용</span>${database[i].content}</p>
      <figure>    
        <p>첨부이미지</p>
          <div class="submit_image">
            <img 
              src="${database[i].image}" 
              width="100%" 
              height="400px" 
              alt="image"></img>
          </div>
      </figure>
`;
  detailContentArea.innerHTML = detailHTML;
};

/* 글 수정 함수 */
function updateFunc() {
  const title = document.getElementById("update_input");
  const content = document.getElementById("update_content");
  database[currentItem].title = title.value;
  database[currentItem].content = content.value;
  reload(); // 수정된 데이터를 데이터 베이스에 삽입 후 재랜더링하는 함수
  board();

  [title.value, content.value] = ["", ""];
}

/* 글 삭제 함수 */
function deleteFunc() {
  const isLogin = JSON.parse(sessionStorage.getItem("user"))?.isLogin || false;
  if (!isLogin) {
    alert("로그인 하세요");
    homeShift();
    return loginToggle();
  }

  database.splice(currentItem, 1);
  reload(); // 수정된 데이터를 데이터 베이스에 삽입 후 재랜더링하는 함수
  board();
}

/* 이전 게시글 이동 */
function prevBtn() {
  if (currentItem <= 0) {
    return (currentItem = 0);
  }
  currentItem--;
  console.log(currentItem);
  detail(currentItem);
}

/* 다음 게시글 이동 */
function nextBtn() {
  if (database.length - 1 > currentItem) currentItem++;
  console.log(currentItem);
  detail(currentItem);
}

// 로그인 버튼 클릭 시 초기화 방지
document.querySelector(".login_form").addEventListener("submit", (e) => {
  e.preventDefault();
});

/* 로그인 정보 입력 */
username.addEventListener("keyup", (e) => {
  loginState.userInfo.username = e.target.value;
});
password.addEventListener("keyup", (e) => {
  loginState.userInfo.password = e.target.value;
});

/* ==========로그인/로그아웃 관리============ */
const loginState = {
  userInfo: {
    isLogin: state.loginHandler(true),
    username: "",
    password: "",
  },

  /* 로그인 */
  login() {
    const user = JSON.stringify(this.userInfo);
    sessionStorage.setItem("user", user);

    // input 초기화
    [this.userInfo.username, this.userInfo.password] = ["", ""];

    const isLogin =
      JSON.parse(sessionStorage.getItem("user")).isLogin || "login";
    isLogin && sessionStorage.setItem("login", "logout");

    loginMessage();
    homeShift();
  },

  /* 로그아웃 */
  logout() {
    sessionStorage.removeItem("user"); // 세션 저장소 유저 정보 제거
    sessionStorage.setItem("login", "login"); // 로그인 메시지 업데이트
    loginIcon.innerHTML = sessionStorage.getItem("login"); // 이하동문

    homeShift();
  },
};

/* 사용자가 로그인 시 메시지를 보여주는 함수 */
function loginMessage() {
  document.querySelector(".login_icon").textContent =
    sessionStorage.getItem("login");

  const username = JSON.parse(sessionStorage.getItem("user")).username;
  const div = document.createElement("div");
  const text = document.createTextNode(
    `환영합니다. ${username} 님! 현재 시간은 ${new Date().toLocaleString()} 입니다.`
  );

  //  안내 메시지 생성
  div.appendChild(text);
  div.classList.add("welcome_message");
  document.body.appendChild(div);

  // 안내 메시지 4초 뒤에 숨기기
  setTimeout(() => {
    div.style.cssText = `
    visibility:"hidden";
    opacity: 0;
    `;
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  loginIcon.textContent = sessionStorage.getItem("login") ?? "login";
});

/* 로그인 토글  */
function loginToggle() {
  document.querySelector(".login_form").classList.toggle("login_on");
  layout.classList.toggle("layout_on");
}

/* 로그인 아이콘 클릭 시 해당 아이콘 텍스트가 login 이라면 login 모달창을 띄운다.  */
loginIcon.addEventListener("click", () => {
  if (loginIcon.textContent === "login") loginToggle();
  try {
    // 유저가 로그인한 상태라면 logout 을 실행한다.
    /* 세션에 데이터가 없다면, null 을 isLogin에 저장한다. */
    const isLogin = JSON.parse(sessionStorage.getItem("user"))?.isLogin;

    // null 이면 뒤에 것을 실행하지 않는다. true 라면 뒤에 함수를 실행한다.
    isLogin && loginState.logout();
  } catch (error) {
    console.log(error + "는 넘어가도 됩니다.");
  }
  /* isLogin이 false 라면 실행 x , true 라면 logout() 호출 */
  if (sessionStorage.getItem("login") === "logout") {
    sessionStorage.setItem("login", "login");
  }
});

// 로그인 정규식 검사 함수
function loginRegex() {
  const pwRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  const unRegex = /[a-zA-Z0-9]{4,}/;
  const pwJudgement = pwRegex.test(password.value);
  const unJudgement = unRegex.test(username.value);

  // 닉네임과 패스워드 정규식 검사가 모두 참이라면 login 처리
  if (unJudgement && pwJudgement) {
    loginState.login();
    loginToggle();
  }
}

document.querySelector(".layout").addEventListener("click", loginToggle);
document.querySelector(".login_sumbit_btn").addEventListener("click", () => {
  loginRegex(); // 정규식 검사 실시
});

render();

function reload() {
  const json = JSON.stringify(database);
  localStorage.setItem("data", json);
  render(database);
}

/* 검색 기능 */
const searchInput = document.getElementById("search_input");
const searchBtn = document.getElementById("search_btn");

searchInput.addEventListener("keyup", (e) => {
  const searchValue = e.target.value;
  search(searchValue, database);
});

searchBtn.addEventListener("click", () => {
  document.getElementById("list_modal").classList.add("modal_on");
});

function search(searchValue, database) {
  /* g: 패턴과 일치하는 모든 대상을 검색 
   i: 대소문자 구분을 무시하고 검색한다.
*/
  const regexp = new RegExp(searchValue, "gi");
  const filteredList = [];

  for (let i = 0; i < database.length; i++) {
    if (regexp.test(database[i].title)) {
      filteredList.push(database[i]);
    }
  }

  filterListModal(filteredList);
}

/* 필터된 리스트를 그리는 함수 */
function filterListModal(database) {
  let listHTML = "";
  listHTML += `<tr><th>글번호</th><th>제목</th><th>작성자</th><th>조회수</th><th>작성일자</th></tr>
  `;
  database.map((_, i) => {
    return (listHTML += `
      <tr onclick="detail(${i})">
          <td>${1 * database[i].id + 1}</td>
          <td>${database[i].title}</td>
          <td>${database[i].writer}</td>
          <td><span>${database[i].count}<span></td>
          <td>${database[i].date}</td>
      </tr>
    `);
  });

  listHTML += ` <button onclick="closeListModal()" class="close_btn">X</button>`;
  document.getElementById("list_modal").innerHTML = listHTML;
}

/* ==========기타 등등 */
function closeListModal() {
  document.getElementById("list_modal").classList.toggle("modal_on");
}

// 페이지 이동
function homeShift() {
  home();
  menuFocus(0);
}

function boardShift() {
  board();
  menuFocus(1);
}

// 이미지 읽어와서 미리보기로 보여줌
function imageReader(e) {
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.addEventListener("load", (e) => {
    imageURL.push(e.target.result);
  });
}
wImage.addEventListener("change", imageReader);

// 메뉴 아이콘 조작
menuIcon.addEventListener("click", () => {
  categoriesNav.classList.toggle("menu_on");
});
