function Stack() {
    this.maskItems = []

    this.push = function (item) {
        this.maskItems.push(item)
    }
    this.pop = function () {
        this.maskItems.pop()
    }
}