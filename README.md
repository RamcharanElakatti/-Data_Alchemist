# 🧙‍♂️ Data Alchemist

> A Next.js app that turns messy CSV/XLSX schedules into a clean, rule‑ready bundle for downstream resource‑allocation engines.  
> Built for the **Digitalyz – Software Engineering Intern** assignment (June 2025).

---

## ✨ Key Features

| Milestone | What it does |
|-----------|--------------|
| **M1 – Ingestion & Validation** | • Upload CSV / XLSX (multi‑sheet) for **Clients / Workers / Tasks**<br>• **GPT‑4o** header‑mapping (handles typos & shuffled columns)<br>• Inline editing with live validation & red‑cell highlights |
| **M2 – Rules Builder** | • Drawer to create **Co‑run** & **Load‑limit** rules (slot‑restriction & phase‑window stubs)<br>• Rules list with delete & precedence order<br>• Exports **rules.json** |
| **M2.5 – Prioritization Weights** | • Slider panel for 5 criteria + preset profiles<br>• Weights stored in Zustand, exported with rules |
| **Export Package** | One‑click download of:<br>  `clients_clean.csv`, `workers_clean.csv`, `tasks_clean.csv`<br>  `rules.json` (**rules + weights**) |

Road‑map: natural‑language filters, NL → rule converter, AI rule recommendations.

---

## 🖼️ Screenshots
![image](https://github.com/user-attachments/assets/c40198ee-f792-44fc-adb2-3c7eb68d6414)

![image](https://github.com/user-attachments/assets/b574a0ef-a13d-4f9d-90a5-3d23d46a15dc)
![image](https://github.com/user-attachments/assets/688caba4-0446-4867-8610-f31c5d63f0d7)
![image](https://github.com/user-attachments/assets/77f67441-b1e6-4102-82ff-4fc37b4d56e4)
![image](https://github.com/user-attachments/assets/6c58a80e-4b3a-485f-9431-039a2be24b81)
![image](https://github.com/user-attachments/assets/6daa189d-b845-4a07-91f8-5320d911d2f5)
![image](https://github.com/user-attachments/assets/8cca0e2e-155d-4e2d-8dc2-220e2329c4d5)

| Upload → Validate | Build Rules | Weights & Export |

| ![upload](docs/upload.gif) | ![rules](docs/rules.gif) | ![weights](docs/weights.gif) |

---

## 🔧 Tech Stack

| Layer           | Libraries |
|-----------------|-----------|
| Frontend UI     | **Next.js 15 App Router**, React 18, Tailwind CSS |
| State & Tables  | Zustand, TanStack Table v8 |
| Validation      | Zod + custom cross‑checks |
| AI Helpers      | OpenAI GPT‑4o‑mini (header mapping) |
| Icons           | lucide‑react |
| Packaging       | PapaParse, FileSaver.js |
| Deployment      | Vercel |

---

## 📁 Project Structure

src/
app/ # pages & layouts
components/ # UploadDrop, DataGrid, RuleDrawer, ...
lib/ # schemas, store, validators, AI helpers
public/ # favicon, sample data

yaml
Copy
Edit

---

## 🚀 Local Setup

```bash
git clone https://github.com/RamcharanElaktti/data-alchemist.git
cd data-alchemist
npm install

# add your OpenAI key (for header mapping)
echo "OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx" > .env.local

npm run dev   # open http://localhost:3000
