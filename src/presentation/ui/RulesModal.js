export class RulesModal {
  constructor() {
    this.overlay = document.createElement("div");
    Object.assign(this.overlay.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(15, 18, 24, 0.78)",
      backdropFilter: "blur(4px)",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "100",
      padding: "20px",
      fontFamily: "system-ui, sans-serif",
    });

    const card = document.createElement("div");
    Object.assign(card.style, {
      maxWidth: "680px",
      maxHeight: "85vh",
      overflowY: "auto",
      background: "#1e242e",
      color: "#f1f5f9",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      padding: "24px 28px",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
      lineHeight: "1.55",
      fontSize: "14.5px",
    });

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.12); padding-bottom:12px;">
        <h2 style="margin:0; font-size:20px; color:#fff;">Правила игры «Воздушный бой»</h2>
        <button id="rules-close-top" style="background:none; border:none; color:#94a3b8; font-size:22px; cursor:pointer; line-height:1;">&times;</button>
      </div>

      <h3 style="margin:14px 0 6px; color:#60a5fa; font-size:15px;">1. Операции за один ход</h3>
      <p style="margin:0 0 8px;">За свой ход игрок поочерёдно передвигает <b>один истребитель</b> и <b>один бомбардировщик</b>. Взлёт с аэродрома идёт только по прямой.</p>
      <ul style="margin:0 0 12px; padding-left:20px;">
        <li><b>Бомбардировщик:</b> 2 клетки прямо <i>или</i> разворот на 180° на месте <i>или</i> поворот на 90° + 1 клетка вперёд.</li>
        <li><b>Истребитель:</b> 3 клетки прямо <i>или</i> поворот на 90° на месте <i>или</i> разворот на 180° + 1 клетка <i>или</i> поворот на 90° + 2 клетки вперёд.</li>
      </ul>

      <h3 style="margin:14px 0 6px; color:#f87171; font-size:15px;">2. Воздушный бой</h3>
      <ul style="margin:0 0 12px; padding-left:20px;">
        <li>Каждый самолёт сбивает самолёт противника в <b>«БОК»</b> и в <b>«ХВОСТ»</b>.</li>
        <li><b>Бомбардировщик</b> дополнительно бьёт <b>истребителя в «ЛОБ»</b>. В лоб равные типы не бьют друг друга.</li>
        <li>Не взлетевшие самолёты на аэродроме сбиваются с любого направления.</li>
        <li>Сбивший самолёт встаёт на место сбитого и завершает свой ход.</li>
      </ul>

      <h3 style="margin:14px 0 6px; color:#fbbf24; font-size:15px;">3. ПВО и победа</h3>
      <ul style="margin:0 0 16px; padding-left:20px;">
        <li><b>Зенитная точка (полудуга):</b> сбивает вражеский самолёт при пролёте над ней <b>спереди и сбоку</b> (с тыла безопасна).</li>
        <li><b>Ракетная установка (кольцо):</b> сбивает вражеский самолёт при пролёте <b>с любой стороны</b>. Над своими ПВО самолёты летят свободно.</li>
        <li><b>Победа:</b> бомбардировщик пролетает над <b>штабом противника</b> (золотой квадрат в углу) либо уничтожена ударная авиация врага.</li>
      </ul>

      <div style="text-align:right;">
        <button id="rules-close-btn" style="padding:9px 20px; border-radius:8px; border:none; background:#2563eb; color:#fff; font-weight:600; cursor:pointer;">Понятно</button>
      </div>
    `;

    this.overlay.appendChild(card);
    document.body.appendChild(this.overlay);

    // Блокируем передачу кликов на 3D-холст
    this.overlay.addEventListener("pointerdown", (e) => e.stopPropagation());
    this.overlay.addEventListener("pointerup", (e) => e.stopPropagation());
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.close();
    });

    card.querySelector("#rules-close-top").addEventListener("click", () => this.close());
    card.querySelector("#rules-close-btn").addEventListener("click", () => this.close());

    window.addEventListener("keydown", this._onKeyDown);
  }

  _onKeyDown = (e) => {
    if (e.key === "Escape") this.close();
  };

  open() {
    this.overlay.style.display = "flex";
  }

  close() {
    this.overlay.style.display = "none";
  }

  dispose() {
    window.removeEventListener("keydown", this._onKeyDown);
    this.overlay.remove();
  }
}
