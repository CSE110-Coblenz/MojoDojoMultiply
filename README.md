# 🎮 MojoDojoMultiply

## 📌 Overview
MojoDojoMultiply is a fast-paced multiplication battle game built using **TypeScript** and **Konva**. Players compete against a computer opponent to answer questions quickly and accurately.

---

## 🚀 Features
- 🧮 **Dynamic multiplication questions**, questions increase in difficulty as rounds go on
- ➗ **Bonus Level every 5 rounds** featuring *division* questions for extra points  
- 🤖 **Computer opponent** with simulated response time and accuracy  
- ⏱️ **Timer-based scoring system**, faster answers reward more points
- 📊 **Round-by-round stats**, including damage, accuracy, and points  
- 📝 **Results screen** summarizing the entire session  
- 🎯 **Practice mode** for unlimited drills  
- ❓ **Help screen** explaining rules, controls, and scoring  
- 🎨 **Konva canvas-based UI** with custom sprites  
- 📦 **Local storage support** via `storageManager.ts`  

---

## 🧱 Project Structure
```
index.html

src/
 ├── AnimedSprites.ts                     
 ├── constants.ts                   
 ├── main.ts               
 ├── storageManager.ts      
 ├── types.ts            
 │
 ├── BonusLevelScreen/
 ├── HelpPageScreen/
 ├── MainPageScreen/
 ├── PracticeAreaScreen/
 ├── ResultsPageScreen/
 ├── RoundIntroScreen/
 ├── RoundStatsScreen/
 ├── StartPageScreen/

```

Each screen follows an MVC pattern:
- **Model** – stores screen/game state  
- **View** – Konva groups, shapes, and UI  
- **Controller** – handles events and transitions  

---

## ⚙️ How to Run

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Start the server
```bash
npm run dev
```

---

## 🤝 How to Contribute

### 1. Create a new branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Stage and commit changes
```bash
git add .
git commit -m "Add: description of your changes"
```

### 3. Push your branch
```bash
git push origin feature/your-feature-name
```

### 4. Open a Pull Request
- Open a PR from your feature branch into `main`.
- Add reviewers.
- Wait for approval before merging.

### Contribution Guidelines
- Keep code formatted and consistent.
- Follow the Controller/Model/View structure.
- Do *not* commit `node_modules`.
- Use meaningful commit messages.
- Test your screen before pushing.
- PRs must follow team coding standards.

---

## 👥 Team Members

| Name |
|------|
| **Mohamed Adem** |
| **Thatcher Eames** | 
| **Richard Gabel** | 
| **Sammy Hamouda** | 
| **Christine Oswald** | 
| **Edgar Seecof** | 