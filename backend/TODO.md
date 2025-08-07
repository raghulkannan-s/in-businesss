
## 🔐 2. **AUTH MODULE (JWT + Bcrypt)**

* [ ] `POST /api/auth/register`
* [ ] `POST /api/auth/login`
* [ ] `GET /api/auth/me` → requires token
* [ ] Middleware: `verifyJWT`
* [ ] Hash password with `bcrypt`
* [ ] Return JWT on login
* [ ] Store roles (`admin`, `scorer`, etc.)

## 🛣️ 5. **ROUTES**

### Auth

* `POST /auth/register`
* `POST /auth/login`
* `GET /auth/me` (Protected)

### Teams & Players

* `POST /teams`
* `GET /teams`
* `POST /teams/:id/players`
* `GET /teams/:id/players`

### Match

* `POST /matches` – create match
* `GET /matches` – all matches
* `GET /matches/:id` – match details
* `PATCH /matches/:id/toss`
* `PATCH /matches/:id/overs`
* `PATCH /matches/:id/winner`

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
