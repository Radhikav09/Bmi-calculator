"use client";
import { useState, useRef } from "react";

export default function Home() {
  // Height inputs
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm"); // "cm", "ft-in", "inches"

  // Weight input
  const [weight, setWeight] = useState("");

  // Result state
  const [bmiResult, setBmiResult] = useState(null);
  const [errors, setErrors] = useState({});

  // Refs for Enter key handling
  const weightInputRef = useRef(null);
  const calculateBtnRef = useRef(null);

  // Conversion helper functions
  const cmToInches = (cm) => cm / 2.54;
  const inchesToCm = (inches) => inches * 2.54;
  const cmToFeetInches = (cm) => {
    const totalInches = cmToInches(cm);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches };
  };
  const feetInchesToCm = (feet, inches) => {
    const totalInches = feet * 12 + inches;
    return inchesToCm(totalInches);
  };

  // Get height in cm from current inputs
  const getHeightInCm = () => {
    if (heightUnit === "cm" && heightCm) {
      return parseFloat(heightCm);
    } else if (heightUnit === "ft-in" && heightFt && heightIn) {
      return feetInchesToCm(parseFloat(heightFt), parseFloat(heightIn));
    } else if (heightUnit === "inches" && heightInches) {
      return inchesToCm(parseFloat(heightInches));
    }
    return null;
  };

  // Handle height unit change
  const handleHeightUnitChange = (newUnit) => {
    setHeightUnit(newUnit);
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setHeightInches("");
    setErrors({});
  };

  // Handle height input changes with conversion display
  const handleHeightCmChange = (value) => {
    setHeightCm(value);
    setErrors((prev) => ({ ...prev, height: null }));
  };

  const handleHeightFtChange = (value) => {
    setHeightFt(value);
    setErrors((prev) => ({ ...prev, height: null }));
  };

  const handleHeightInChange = (value) => {
    setHeightIn(value);
    setErrors((prev) => ({ ...prev, height: null }));
  };

  const handleHeightInchesChange = (value) => {
    setHeightInches(value);
    setErrors((prev) => ({ ...prev, height: null }));
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    setErrors((prev) => ({ ...prev, weight: null }));
  };

  // Validate inputs
  const validateInputs = () => {
    const newErrors = {};
    const h = getHeightInCm();
    const w = parseFloat(weight);

    if (!h || h <= 0 || h > 300) {
      newErrors.height = "Please enter a valid height (between 0 and 300 cm)";
    }

    if (!w || w <= 0 || w > 600) {
      newErrors.weight = "Please enter a valid weight (between 0 and 600 kg)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get BMI category and color
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) {
      return {
        category: "Underweight",
        description: "Below healthy weight range",
        color: "bg-blue-100 border-blue-300",
        textColor: "text-blue-900",
      };
    } else if (bmi < 25) {
      return {
        category: "Normal Weight",
        description: "Healthy weight range",
        color: "bg-green-100 border-green-300",
        textColor: "text-green-900",
      };
    } else if (bmi < 30) {
      return {
        category: "Overweight",
        description: "Above healthy weight range",
        color: "bg-amber-100 border-amber-300",
        textColor: "text-amber-900",
      };
    } else {
      return {
        category: "Obesity",
        description: "Significantly above healthy weight range",
        color: "bg-red-100 border-red-300",
        textColor: "text-red-900",
      };
    }
  };

  // Calculate BMI
  const calculateBMI = () => {
    if (!validateInputs()) {
      return;
    }

    const h = getHeightInCm();
    const w = parseFloat(weight);

    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);
    const roundedBMI = bmi.toFixed(1);

    const categoryInfo = getBMICategory(bmi);

    setBmiResult({
      bmi: roundedBMI,
      category: categoryInfo.category,
      description: categoryInfo.description,
      color: categoryInfo.color,
      textColor: categoryInfo.textColor,
      heightCm: h.toFixed(2),
      weight: w,
    });
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculateBMI();
    }
  };

  // Reset all inputs
  const handleReset = () => {
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setHeightInches("");
    setWeight("");
    setBmiResult(null);
    setErrors({});
  };

  // Get height conversion display
  const getHeightConversion = () => {
    const h = getHeightInCm();
    if (!h) return null;

    const inches = cmToInches(h).toFixed(2);
    const { feet, inches: remainingInches } = cmToFeetInches(h);

    return {
      cm: h.toFixed(2),
      inches: inches,
      feetInches: `${feet} ft ${remainingInches.toFixed(2)} in`,
    };
  };

  const heightConversion = getHeightConversion();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Health Calculator
          </h1>
          <p className="text-slate-600">BMI Calculator & Height Converter</p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          {/* Height Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-semibold text-slate-800">
                Height
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleHeightUnitChange("cm")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    heightUnit === "cm"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  cm
                </button>
                <button
                  onClick={() => handleHeightUnitChange("ft-in")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    heightUnit === "ft-in"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  ft + in
                </button>
                <button
                  onClick={() => handleHeightUnitChange("inches")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    heightUnit === "inches"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  inches
                </button>
              </div>
            </div>

            {/* Height Input Fields */}
            {heightUnit === "cm" && (
              <div>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Enter height"
                      value={heightCm}
                      onChange={(e) => handleHeightCmChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex items-center px-4 bg-slate-100 rounded-lg font-semibold text-slate-800">
                    cm
                  </div>
                </div>
                {errors.height && (
                  <p className="text-sm text-red-600">{errors.height}</p>
                )}
              </div>
            )}

            {heightUnit === "ft-in" && (
              <div>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Feet"
                      value={heightFt}
                      onChange={(e) => handleHeightFtChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex items-center px-4 bg-slate-100 rounded-lg font-semibold text-slate-800">
                    ft
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Inches"
                      value={heightIn}
                      onChange={(e) => handleHeightInChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex items-center px-4 bg-slate-100 rounded-lg font-semibold text-slate-800">
                    in
                  </div>
                </div>
                {errors.height && (
                  <p className="text-sm text-red-600">{errors.height}</p>
                )}
              </div>
            )}

            {heightUnit === "inches" && (
              <div>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Enter height"
                      value={heightInches}
                      onChange={(e) =>
                        handleHeightInchesChange(e.target.value)
                      }
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex items-center px-4 bg-slate-100 rounded-lg font-semibold text-slate-800">
                    in
                  </div>
                </div>
                {errors.height && (
                  <p className="text-sm text-red-600">{errors.height}</p>
                )}
              </div>
            )}

            {/* Height Conversion Display */}
            {heightConversion && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-slate-700 mb-2">
                  <span className="font-semibold">{heightConversion.cm} cm</span>
                  {" = "}
                  <span className="text-blue-700 font-semibold">
                    {heightConversion.inches} inches
                  </span>
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">{heightConversion.cm} cm</span>
                  {" = "}
                  <span className="text-blue-700 font-semibold">
                    {heightConversion.feetInches}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Weight Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-slate-800 mb-3">
              Weight
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  ref={weightInputRef}
                  type="number"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                />
              </div>
              <div className="flex items-center px-4 bg-slate-100 rounded-lg font-semibold text-slate-800">
                kg
              </div>
            </div>
            {errors.weight && (
              <p className="text-sm text-red-600 mt-2">{errors.weight}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              ref={calculateBtnRef}
              onClick={calculateBMI}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg transition-colors"
            >
              Calculate BMI
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-3 rounded-lg text-lg transition-colors"
            >
              Reset
            </button>
          </div>

          {/* BMI Result */}
          {bmiResult && (
            <div
              className={`${bmiResult.color} border-2 rounded-lg p-6 mb-6`}
            >
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600 mb-2">
                  Your BMI
                </p>
                <p className={`text-5xl font-bold ${bmiResult.textColor} mb-2`}>
                  {bmiResult.bmi}
                </p>
                <p className={`text-2xl font-semibold ${bmiResult.textColor} mb-2`}>
                  {bmiResult.category}
                </p>
                <p className={`text-sm ${bmiResult.textColor}`}>
                  {bmiResult.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BMI Formula Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">
            How BMI is Calculated
          </h2>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-slate-700 text-sm font-mono mb-2">
              BMI = Weight (kg) / (Height (m))²
            </p>
            <p className="text-slate-600 text-sm">
              BMI is a screening tool that measures body composition based on
              height and weight. While useful for population studies, it doesn't
              distinguish between muscle and fat, so it should be considered
              alongside other health metrics.
            </p>
          </div>
        </div>

        {/* BMI Categories Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            BMI Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold text-blue-900">Underweight</p>
              <p className="text-sm text-slate-600">BMI &lt; 18.5</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold text-green-900">Normal Weight</p>
              <p className="text-sm text-slate-600">BMI 18.5 - 24.9</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <p className="font-semibold text-amber-900">Overweight</p>
              <p className="text-sm text-slate-600">BMI 25 - 29.9</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-semibold text-red-900">Obesity</p>
              <p className="text-sm text-slate-600">BMI ≥ 30</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}