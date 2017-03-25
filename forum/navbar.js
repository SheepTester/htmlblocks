document.querySelector('navbar navbtn').onclick=e=>{
  document.body.classList.add('SIDEBARISOPENWOW');
};
document.querySelector('div.container').onclick=e=>{
  document.body.classList.remove('SIDEBARISOPENWOW');
};
document.querySelector('navbar logo').onclick=e=>{
  if (document.querySelector('navbar div.navLOGO').classList.contains('active')) document.querySelector('navbar div.navLOGO').classList.remove('active');
  else document.querySelector('navbar div.navLOGO').classList.add('active');
};
document.querySelector('navbar user').onclick=e=>{
  if (document.querySelector('navbar div.navUSER').classList.contains('active')) document.querySelector('navbar div.navUSER').classList.remove('active');
  else document.querySelector('navbar div.navUSER').classList.add('active');
};
