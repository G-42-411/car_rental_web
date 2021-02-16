<template>
    <div class="container">
        <div class="box">
            <div class="box-item">
                <label for="username"></label>
                <input id="username" name="username" type="text" placeholder="please input your username">
            </div>
            <div class="box-item">
                <label for="password"></label>
                <input id="password" name="password" type="password" placeholder="please input your password">
            </div>
            <a-button class="btn">sign in</a-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login"
    }
</script>

<style lang="scss" scoped>
.container{
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .box{
        width: 400px;
        height: 450px;
    }
}


</style>
