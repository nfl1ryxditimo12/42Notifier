const puppeteer = require("puppeteer");

module.exports = async (eventId) => {
    try {
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        const login = process.env.FT_LOGIN;
        const password = process.env.FT_PASSWORD;

        await page.goto("https://signin.intra.42.fr/users/sign_in");

        await page.evaluate(
            (id, pw) => {
                document.querySelector('input[name="user[login]"]').value = id;
                document.querySelector('input[name="user[password]"]').value = pw;
            },
            login,
            password
        );

        await page.click('input[name="commit"]');

        await page.waitForTimeout(5000);

        await page.goto("https://profile.intra.42.fr");

        await page.click(`a[data-url="/events/${eventId}"]`);

        await page.waitForTimeout(3000);

        await page
            .click('a[data-disable-with="Submiting..."]')
            .then((res) => console.log("\x1b[34m[Event] - 이벤트 등록 성공\x1b[m"))
            .catch((err) => console.log("\x1b[31m[Event] - 이벤트 등록 실패\x1b[m"));

        await browser.close();
    } catch (err) {
        console.log("\x1b[31m[Crawling] - 크롤링에 실패하였습니다.\x1b[m");
    }
};
