var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");

var cwidth, cheight;
var shells = [];
var pass = [];

var colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA'
,'#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740'
,'#FFAB40', '#FF6E40', '#FF6600', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#CCFFFF'
,'#FFCC00', '#FFCC33', '#FFCC66', '#FFCC99', '#FFCCCC', '#FFCCFF', '#FFFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFFFCC'
,'#CCCCFF', '#CCCCCC', '#CCCC99', '#CCCC66', '#CC66FF',
,'#FF6633', '#FF9900', '#FF9933', '#FF9966', '#FF9999', '#FF99CC', '#FF99FF'
// ,'#000066','#000099','#0000CC','#0000FF','#003300','#003333','#003366'
// ,'#003399','#0033CC','#0033FF','#006600','#006633','#006666','#006699'
// ,'#0066CC','#0066FF','#009900','#009933','#009966','#009999','#0099CC'
// ,'#0099FF','#00CC00','#00CC33','#00CC66','#00CC99','#00CCCC','#00CCFF'
// ,'#330066','#330099','#3300CC','#3300FF','#3333CC','#3333FF','#336600'
// ,'#336633','#336666','#336699','#3366CC','#3366FF','#339900','#339933'
// ,'#339966','#339999','#3399CC','#3399FF','#33CC00','#33CC33','#33CC66'
// ,'#33CC99','#33CCCC','#CC66CC','#CC6699','#CC6666','#CC6633','#CC6600'
// ,'#CC3300','#CC3333','#CC3366','#CC3399','#CC33CC','#CC33FF','#CC00FF'
// ,'#99FFFF','#99FFCC','#99FF99','#99FF66','#99FF33','#99FF00','#99CC00'
// ,'#99CC33','#99CC66','#99CC99','#99CCCC','#99CCFF','#9999FF','#9999CC'
// ,'#999999','#9966FF','#9966CC','#996699','#66FF00','#66FF33','#66FF66'
// ,'#66FF99','#66FFCC','#9900CC','#9933FF','#9933CC','#990099','#9900CC'
// ,'#66FFFF','#66CCFF','#6633FF','#33FFFF','#6600FF','#33FFCC'
// ,'#33FF99','#33FF66','#33FF33','#33FF00','#33CCFF','#FF3399'
];
window.onresize = function () { reset(); }
reset();
function reset() {

  cwidth = window.innerWidth;
  cheight = window.innerHeight;
  c.width = cwidth;
  c.height = cheight;
}

function newShell() {

  var left = (Math.random() > 0.5);
  var shell = {};
  shell.x = (1 * left);
  shell.y = 1;
  //edit X Y
  shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1 : -1);
  shell.yoff = 0.012 + Math.random() * 0.007;
  //edit size 
  shell.size = Math.random() * 6 + 1;
  shell.color = colors[Math.floor(Math.random() * colors.length)];

  shells.push(shell);
}

function newPass(shell) {
// số pháo mũ 6
  var pasCount = Math.ceil(Math.pow(shell.size, 6) * Math.PI);

  for (i = 0; i < pasCount; i++) {

    var pas = {};
    pas.x = shell.x * cwidth;
    pas.y = shell.y * cheight;

    var a = Math.random() * 4;
    var s = Math.random() * 10;

    pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
    pas.yoff = s * Math.sin(a * (Math.PI / 2));

    pas.color = shell.color;
    pas.size = Math.sqrt(shell.size);

    if (pass.length < 1000) { pass.push(pas); }
  }
}

var lastRun = 0;

function Run() {
  var audio = new Audio('./bum.mp3');
  var dt = 1;
  if (lastRun != 0) { dt = Math.min(50, (performance.now() - lastRun)); }
  lastRun = performance.now();

  //ctx.clearRect(0, 0, cwidth, cheight);
  ctx.fillStyle = "rgba(0,0,0,0.15)";

  ctx.fillRect(0, 0, cwidth, cheight);

  if ((shells.length < 10) && (Math.random() > 0.96)) { newShell(); }

  for (let ix in shells) {

    var shell = shells[ix];

    ctx.beginPath();
    ctx.arc(shell.x * cwidth, shell.y * cheight, shell.size, 0, 2 * Math.PI);
    ctx.fillStyle = shell.color;
    ctx.fill();

    shell.x -= shell.xoff;
    shell.y -= shell.yoff;
    shell.xoff -= (shell.xoff * dt * 0.001);
    shell.yoff -= ((shell.yoff + 0.2) * dt * 0.00005);

    if (shell.yoff < -0.005) {
      newPass(shell);
      //document.getElementById("box").innerHTML = "<audio src='bum.mp3' type='audio/mpeg' id='audio'></audio>";
      //document.getElementById("audio").play();
      //document.getElementById("box").innerHTML ="";

      audio.volume = 0.5;
      audio.play();
      shells.splice(ix, 1);
    }
  }

  for (let ix in pass) {

    var pas = pass[ix];

    ctx.beginPath();
    ctx.arc(pas.x, pas.y, pas.size, 2, 2 * Math.PI);
    ctx.fillStyle = pas.color;
    ctx.fill();

    pas.x -= pas.xoff;
    pas.y -= pas.yoff;
    pas.xoff -= (pas.xoff * dt * 0.001);
    pas.yoff -= ((pas.yoff + 5) * dt * 0.0005);
    pas.size -= (dt * 0.002 * Math.random())

    if ((pas.y > cheight) || (pas.y < -50) || (pas.size <= 0)) {
      pass.splice(ix, 1);
    }
  }
  requestAnimationFrame(Run);
}