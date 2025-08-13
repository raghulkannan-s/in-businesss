
### Score Recording

* `POST /matches/:id/scores` – update per ball
* `GET /matches/:id/scoreboard`

### Mongo Logs

* `POST /logs` – store log
* `GET /logs/:matchId`

### Screenshot Upload

* `POST /upload/screenshot` (multer)
* `GET /screenshot/:id`

---

## 🧠 6. **CORE LOGIC & VALIDATION**

* [ ] Toss logic: save toss winner, opted action
* [ ] Opening setup: striker, non-striker, bowler
* [ ] Auto-calculation on scoring: update player stats + over tracking
* [ ] Wicket logic: select bowler, who’s out, next batsman
* [ ] Save button stores state + syncs with frontend
* [ ] Generate scoreboard summary by matchId

---

## ⚙️ 7. **MIDDLEWARES**

* `verifyJWT`
* `errorHandler`
* `uploadMiddleware` (Multer)
* `validateBody`

---

## 📦 8. **DEPLOYMENT PREP**

* [ ] `pm2` process manager
* [ ] Nginx reverse proxy
* [ ] HTTPS with Let's Encrypt
* [ ] `.env` secrets
* [ ] Auto-deploy with GitHub or manual zip pull
