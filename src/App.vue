<template>
  <div id="app">
    <div hidden id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
// Global styles
@import '~@/styles/global.scss';
</style>

<style lang="scss">

#app {
	font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
	font-size: 16px;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

</style>
