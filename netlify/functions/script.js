document.addEventListener("DOMContentLoaded", () => {
  const chatbox = document.getElementById("chatbox");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  let rifaData = [];

  // Mensaje inicial
  chatbox.innerHTML = "<p><strong>Bienvenido 👋</strong>, soy el asistente de la Filial Valle Viejo La Banda de River.</p>";

  // Leer Excel de rifas
  async function cargarRifa() {
    try {
      const response = await fetch("docs/rifa.xlsx");
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const hoja = workbook.Sheets[workbook.SheetNames[0]];
      rifaData = XLSX.utils.sheet_to_json(hoja);
    } catch (error) {
      console.error("Error al cargar el Excel de rifas:", error);
    }
  }
  cargarRifa();

  // Buscar número en la rifa
  function buscarNumero(num) {
    const registro = rifaData.find(r => r.Núme == num);
    if (registro) {
      const estado = registro.Estado ? registro.Estado.toLowerCase() : "desconocido";
      const pago = registro.PAGO ? registro.PAGO.toLowerCase() : "";
      return `El número ${num} está ${estado}, comprado por ${registro["Comprado por"] || "N/A"}${pago === "pago" ? " (pagado)" : " (pendiente)"}`;
    } else {
      return `El número ${num} no existe en la lista.`;
    }
  }

  // Fixture completo
  const fixture = [
    "3 de julio 2026: River vs Flamengo (Amistoso)",
    "17 de julio 2026: River vs Aldosivi (Copa Argentina)",
    "26 de julio 2026: River vs Barracas Central (Liga Profesional)",
    "29 de julio 2026: Gimnasia LP vs River (Liga Profesional)",
    "2 de agosto 2026: River vs Rosario Central (Liga Profesional)",
    "9 de agosto 2026: Tigre vs River (Liga Profesional)",
    "12 y 19 de agosto 2026: River vs Playoff Winner F (Copa Sudamericana, ida y vuelta)"
  ];

  // Respuestas básicas
  function basicAnswer(text) {
    const lower = text.toLowerCase();

    // Consultas de rifa
    if (lower.includes("número") || lower.includes("rifa")) {
      const match = text.match(/\d+/);
      if (match) {
        return buscarNumero(parseInt(match[0]));
      }
    }
    if (lower.includes("vendidos")) {
      const vendidos = rifaData.filter(r => r.Estado && r.Estado.toLowerCase() === "ocupado");
      if (vendidos.length > 0) {
        return "Números vendidos:\n" + vendidos.map(r => r.Núme).join(", ");
      } else {
        return "Todavía no hay números vendidos.";
      }
    }

    // Fixture
    if (lower.includes("fixture") || lower.includes("cuando juega") || lower.includes("cuándo juega") || lower.includes("próximo partido")) {
      return "Fixture de River 2026:\n" + fixture.join("\n");
    } else if (lower.includes("contra quien") || lower.includes("contra quién")) {
      return "River enfrenta a Flamengo el 3 de julio, Aldosivi el 17 de julio y Barracas Central el 26 de julio.";
    }

    // Autoridades
    if (lower.includes("presidente")) return "El Presidente es Villagra Velazco Emmanuel.";
    if (lower.includes("vicepresidente")) return "El Vicepresidente es Sandoval José Emmanuel.";
    if (lower.includes("secretario")) return "El Secretario es Gaitan Carlos Matias.";
    if (lower.includes("tesorero")) return "El Tesorero es Romero Alexis.";
    if (lower.includes("autoridades") || lower.includes("comisión")) {
      return "Las autoridades son: Presidente Villagra Velazco Emmanuel, Vicepresidente Sandoval José Emmanuel, Secretario Gaitan Carlos Matias y Tesorero Romero Alexis.";
    }

    // Generales
    if (lower.includes("cuota")) return "La cuota mensual de la filial se paga en la sede o por transferencia bancaria.";
    if (lower.includes("viaje")) return "Los viajes se organizan para partidos importantes, podés consultar fechas en la sede.";
    if (lower.includes("beneficio")) return "Los socios tienen prioridad en entradas, viajes y actividades especiales.";

    return "Gracias por tu consulta, pronto te daremos más información.";
  }

  // Función para enviar mensaje
  function sendMessage() {
    const userText = input.value.trim();
    if (userText !== "") {
      chatbox.innerHTML += `<p><strong>Tú:</strong> ${userText}</p>`;
      chatbox.innerHTML += `<p><strong>Asistente:</strong> ${basicAnswer(userText)}</p>`;
      input.value = "";
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }

  // Eventos
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
});
