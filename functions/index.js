const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();


const apiKey = "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";


const normalizeText = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const checkAndSetIrrigationState = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentDay = normalizeText(
        new Date().toLocaleString("es-DO", {
          weekday: "long",
          ...options,
        }).toLowerCase(),
    );
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const docRef = db.collection("RiegoN1").doc("schedule1");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const selectedDays = data.selectedDays || [];
      const normalizedSelectedDays = selectedDays.map((day) =>
        normalizeText(day),
      );

      if (normalizedSelectedDays.includes(currentDay)) {
        const wateringTime = data.wateringTime;
        const [wateringHour, wateringMinute] = wateringTime
            .split(":")
            .map(Number);
        const [currentHour, currentMinute] = currentHourString
            .split(":")
            .map(Number);

        if (wateringHour === currentHour && wateringMinute === currentMinute) {
          const currentState = data.state;
          if (currentState !== "on") {
            await docRef.set({state: "on"}, {merge: true});
          }
        } else {
          await docRef.set({state: "off"}, {merge: true});
        }
      } else {
        await docRef.set({state: "off"}, {merge: true});
      }
    } else {
      console.log("No se encontró la programación de riego en Firestore.");
    }
  } catch (error) {
    console.error("Error al verificar y establecer el estado de riego:", error);
  }
};

const checkAndSetLightState = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const docRef = db.collection("LuzN1").doc("schedule1");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const turnOnTime = data.turnOnTime;
      const turnOffTime = data.turnOffTime;
      const [turnOnHour, turnOnMinute] = turnOnTime.split(":").map(Number);
      const [turnOffHour, turnOffMinute] = turnOffTime.split(":").map(Number);
      const [currentHour, currentMinute] =
        currentHourString.split(":").map(Number);

      if (
        (currentHour === turnOnHour && currentMinute === turnOnMinute) ||
        (currentHour > turnOnHour && currentHour < turnOffHour) ||
        (currentHour === turnOffHour && currentMinute < turnOffMinute) ||
        (turnOnHour > 12 && turnOffHour < 12)
      ) {
        await docRef.set({state: "on"}, {merge: true});
      } else {
        await docRef.set({state: "off"}, {merge: true});
      }
    } else {
      console.log("No se encontró la programación de luz en Firestore.");
    }
  } catch (error) {
    console.error("Error al verificar y establecer el estado de luz:", error);
  }
};

const getPlantName = async (index) => {
  const db = admin.firestore();
  try {
    const docRef = db.collection("plantNamesN1").doc(`plant${index}`);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return docSnap.data().name;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo el nombre de la planta:", error);
    return null;
  }
};

const saveMessage = async (sender, message) => {
  try {
    const db = admin.firestore();
    const timestamp = new Date();
    const docRef = db.collection("chatHistory")
        .doc(timestamp.getTime().toString());
    await docRef.set({
      sender: sender,
      message: message,
      timestamp: timestamp,
    });
    console.log("Mensaje guardado correctamente en Firestore");
  } catch (error) {
    console.error("Error al guardar el mensaje en Firestore:", error);
  }
};


const getSensorData = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const pHDataCollection = db.collection("sensor_Ph");
    const pHQuery = pHDataCollection.orderBy("date", "desc").limit(1);
    const pHQuerySnapshot = await pHQuery.get();
    let pH = null;
    pHQuerySnapshot.forEach((doc) => {
      pH = doc.data().pH;
    });


    const sensorDataCollection = db.collection("sensors_dataN1");
    const q = sensorDataCollection.orderBy("date", "desc").limit(1);

    const querySnapshot = await q.get();

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      const timestamp = new Date();
      const formattedDate = timestamp.toLocaleDateString("es-DO", options);

      const plantName1 = await getPlantName(1);
      const plantName2 = await getPlantName(2);
      const plantName3 = await getPlantName(3);

      const ultimosDatosSensores = `Los datos de los sensores:\n` +
        `Temperatura: ${data.temperature} °C\n` +
        `Humedad: ${data.humidity} %\n` +
        `Humedad de la planta ${plantName1}: ${data.moisture} %\n` +
        `Humedad de la planta ${plantName2}: ${data.moisture2} %\n` +
        `Humedad de la planta ${plantName3}: ${data.moisture} %\n` +
        `Luz: ${data.lux} ohmios\n` +
        `pH: ${pH}\n` +
        `Fecha: ${formattedDate} \n` +
        `Hora: ${currentHourString}`;


      await saveMessage("Sensors", ultimosDatosSensores);

      if (ultimosDatosSensores) {
        const mensajeAI = `Los datos de los sensores: 
        ${JSON.stringify(ultimosDatosSensores)}`;


        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: mensajeAI}],
            max_tokens: 150,
          }),
        });


        if (!response.ok) {
          console.error("Error al solicitar respuesta de la IA:"
              , response.status);
          return;
        }
      }
    });
  } catch (error) {
    console.error("Error al obtener los datos del sensor:", error);
  }
};


exports.scheduleCheck = functions.pubsub
    .schedule("every 1 minutes")
    .onRun(async (context) => {
      await checkAndSetIrrigationState();
      await checkAndSetLightState();
    });
exports.scheduleCheck30Minutes = functions.pubsub
    .schedule("every 30 minutes")
    .onRun(async (context) => {
      await getSensorData();
    });

