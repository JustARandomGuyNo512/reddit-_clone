import unittest
from selenium import webdriver
import time


class TestRedditPage(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(30)
        self.driver.get("http://localhost:3000")
        time.sleep(1)
        self.login()

    def tearDown(self):
        self.driver.quit()

    def login(self):
        # 获取登录按钮
        signIn_btn = self.driver.find_element(by="xpath", value="/html/body/div[1]/div/a[2]")
        signIn_btn.click()
        time.sleep(0.5)
        github_btn = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div/div[2]/button")
        github_btn.click()
        time.sleep(0.5)
        username_input = self.driver.find_element(by="xpath", value="/html/body/div[1]/div[3]/main/div/div[3]/form/input[3]")
        password_input = self.driver.find_element(by="xpath", value="/html/body/div[1]/div[3]/main/div/div[3]/form/div/input[1]")
        username_input.send_keys("")  # Github账号
        password_input.send_keys("")  # 密码
        login_btn = self.driver.find_element(by="xpath", value="/html/body/div[1]/div[3]/main/div/div[3]/form/div/input[13]")
        login_btn.click()
        time.sleep(8)

    def test_create_community(self):
        try:
            self.driver.get("http://localhost:3000")
            # 获取创建社区按钮
            create_community = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div[2]/a")
            self.assertEqual(create_community.text, "Create Community", "创建社区按钮不存在")
            # 点击创建社区
            create_community.click()
            # 进入新页面
            new_url = "http://localhost:3000/r/create"
            time.sleep(3)
            self.assertEqual(new_url, self.driver.current_url, "进入创建社区页面失败")
            # 获取标题
            form_title = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div[1]/h1")
            self.assertEqual(form_title.text, "Create a Community", "表单不存在")
            # 创建社区名字 input获取
            name_input = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div[2]/div/input")
            name_input.clear()
            name_input.send_keys("sss")
            # 创建社区按钮获取
            create_btn = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div[3]/button[2]")
            create_btn.click()
            # 重复提示
            text_element = self.driver.find_element(by="xpath", value="/html/body/div[3]/ol/li/div/div[1]")
            self.assertEqual(text_element.text, "该社区已存在", "重复提示失败")
            time.sleep(2)  # 等待两秒

            name_input.clear()
            name_input.send_keys("ceshi666")
            create_btn.click()
            time.sleep(5)  # 等待两秒
            # 是否自动进入新社区
            new_community_url = "http://localhost:3000/r/ceshi666"
            self.assertEqual(new_community_url, self.driver.current_url, "进入新创建的社区页面失败")
            time.sleep(2)
        except Exception as msg:
            print(msg)

    def test_create_post(self):
        try:
            baseUrl = "http://localhost:3000/r/ceshi666"
            self.driver.get(baseUrl)
            time.sleep(2)
            create_post = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div/div[2]/dl/a")
            create_post.click()
            time.sleep(2)
            new_url = baseUrl + "/submit"
            self.assertEqual(new_url, self.driver.current_url, "进入创建帖子页面失败")
            title_input = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div/div[1]/div/div[2]/form/div/textarea")
            text_title = "ceshi666_title"
            text_content = "ceshi666_content"
            title_input.send_keys(text_title)
            content_input = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div/div[1]/div/div[2]/form/div/div/div/div[1]/div/div/div")
            content_input.send_keys(text_content)
            send_btn = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div/div[1]/div/div[3]/button")
            send_btn.click()
            time.sleep(2)
            page_source = self.driver.page_source
            self.assertTrue(text_title in page_source, "创建帖子标题不存在")
            self.assertTrue(text_content in page_source, "创建帖子内容不存在")
        except Exception as msg:
            print(msg)

    def test_comment(self):
        try:
            self.driver.get("http://localhost:3000")
            self.driver.find_element(by="xpath",value="/html/body/div[2]/div/ul/div[1]/div[1]/div[2]/a").click()
            comment_input = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div/div[1]/div/div/div[2]/div/div[1]/div/textarea")
            comment_input.send_keys("cccshishishitttt")
            send_btn = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div/div[1]/div/div/div[2]/div/div[1]/div/div/button")
            send_btn.click()
            time.sleep(2)
            page_source = self.driver.page_source
            self.assertTrue("cccshishishitttt" in page_source, "评论未发布成功")
        except Exception as msg:
            print(msg)

    def test_up_down(self):
        try:
            self.driver.get("http://localhost:3000")
            up_btn = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/ul/div[1]/div[1]/div[1]/button[1]")
            up_btn.click()
            time.sleep(1.5)
            num_p = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/ul/div[1]/div[1]/div[1]/p")
            self.assertEqual("1", num_p.text, "点赞数量不对")
            down_btn = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/ul/div[1]/div[1]/div[1]/button[2]")
            down_btn.click()
            time.sleep(1.5)
            self.assertEqual("0", num_p.text, "点赞数量不对")
        except Exception as msg:
            print(msg)

    def test_settings(self):
        try:
            self.driver.get("http://localhost:3000/settings")

            username_input = self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div/form/div/div[2]/div/input")
            username_input.send_keys("ceshi_name")
            self.driver.find_element(by="xpath", value="/html/body/div[2]/div/div/div/form/div/div[3]/button").click()

            time.sleep(0.5)
            toast_text = self.driver.find_element(by="xpath", value="/html/body/div[3]/ol/li/div/div")
            self.assertEqual("已更新", toast_text.text, "更新名字失败")
        except Exception as msg:
            print(msg)


if __name__ == "__main__":
    unittest.main()
