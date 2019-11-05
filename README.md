# Project
<h3>add /admin/users for A3</h3>


# Getting Start
<pre><code>
[~/] $ git clone https://github.com/judy1230/AC_SEM4_A3.git
[~/] $ npm i express
[~/] $ npm run dev
</pre></code>
open browser with http://localhost:3000/
# Display
![Minion](https://upload.cc/i1/2019/10/30/k0vI4x.gif)

# Features
|       Option       |                                           Description                               |
| ------------------ |------------------------------------------------------------------------------------ |
| admin可以瀏覽所有使用者資料   |  首頁按下admin後台>users, redirect到 'http://localhost:3000/admin/users' 瀏覽所有使用者資料                  |
|                    |    相關資料: controllers/adminController.js/.editUsers, views/admin/users.handlebars                                                      |
| admin可以設定user為admin  | /admin/users頁面下選擇按下 set as admin / set as user, redirect到 'http://localhost:3000/admin/users'瀏覽該user是否更新, 出現更新成功提醒               |
|                    |    相關資料:   controllers/adminController.js/.putUsers, views/admin/users.handlebars                                                        |
  
                        

# Authors
  <li>Judy</li> <p>first edited on 10/30/2019</p>
