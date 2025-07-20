"use client";
import { useState } from "react";

export default function Home() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState("");

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      setResult("❌ Please enter valid height and weight.");
      return;
    }

    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);
    const roundedBMI = bmi.toFixed(1);

    let category = "";
    let advice = "";

    if (bmi < 18.5) {
      category = "Underweight";
      advice = "Eat protein-rich food. Increase calories.";
    } else if (bmi < 25) {
      category = "Normal";
      advice = "Maintain healthy diet and regular exercise.";
    } else if (bmi < 30) {
      category = "Overweight";
      advice = "Cut down sugar, stay active, drink water.";
    } else {
      category = "Obese";
      advice = "Avoid junk food, try a low-carb diet, consult a doctor.";
    }

    setResult(`Your BMI is ${roundedBMI} (${category})\n\nAdvice: ${advice}`);
  };

  return (
    <main className="min-h-screen bg-black-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-green-600 mb-6">BMI Calculator</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block text-black font-semibold mb-1">Height (cm):</label>
        <input
          type="number"
          placeholder="Height in cm"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full p-2 mb-4 border border-black-300 rounded"
        />
        <label className="block text-black font-semibold mb-1">Weight (kg):</label>
        <input
          type="number"
          placeholder="Weight in kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2 mb-4 border border-black-300 rounded"
        />
        <button
          onClick={calculateBMI}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Calculate BMI
        </button>
        <div className="mt-4 whitespace-pre-line text-pink-800">{result}</div>
      </div>
    </main>
  );
}