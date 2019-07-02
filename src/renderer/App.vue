<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'my-electron',
  methods: {

  },
  mounted () {

  }
}
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css");
@import url("//at.alicdn.com/t/font_1254014_t0s23ge5hs.css");
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
}
.el-slider__button {
  width: 4px !important;
  height: 4px !important;
  border: 5px solid #fff !important;
  background: red !important;
  box-shadow: 0px 0px 2px #333 !important;
}
.el-slider__bar {
  background: red !important;
}
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
.el-tabs--card > .el-tabs__header .el-tabs__item {
  transition: color 0s !important;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background: #d63131;
  color: #fff;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active:hover {
  color: #fff !important;
}
.el-tabs__item:hover {
  color: #303133 !important;
}
.el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
}
.el-tabs__active-bar {
  background: #d63131 !important;
  height: 1px !important;
}
.el-tabs__nav-wrap::after {
  height: 1px !important;
}
/* CSS */
</style>
