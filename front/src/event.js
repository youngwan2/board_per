/* 이벤트 리스너 등록 */
try{
document.querySelector(".prev_btn").addEventListener("click", prevBtn);
document.querySelector(".next_btn").addEventListener("click", nextBtn);
document.querySelector(".update_btn").addEventListener("click", update); // 수정 페이지 이동
document.querySelector(".update").addEventListener("click", updateFunc);
document.querySelector(".del_btn").addEventListener("click", deleteFunc);
document.querySelector(".cancel_btn").addEventListener("click", board);
document.querySelector(".writing_btn").addEventListener("click", writing);
document.querySelector(".home_logo").addEventListener("click",homeShift);
} catch(error){
    console.log(error)
}