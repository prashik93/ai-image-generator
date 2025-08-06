import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState("1024x1024");
  const [style, setStyle] = useState("cartoon");
  const [count, setCount] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const aspectPresets = [
    { label: "Square (1:1)", value: "1024x1024" },
    { label: "Landscape (16:9)", value: "1792x1024" },
    { label: "Portrait (9:16)", value: "1024x1792" },
    { label: "Instagram Portrait (4:5)", value: "1024x1280" },
    { label: "Instagram Landscape (1.91:1)", value: "1910x1000" }
  ];

  const generateImage = async () => {
    if (!prompt) return alert("Please enter a prompt");
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, aspect, style, count })
    });

    const data = await res.json();
    setImages(data.images || []);
    setLoading(false);
  };

  const downloadImage = (base64Data, index) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = `generated-image-${index + 1}.png`;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      const link = document.createElement("a");
      link.href = img;
      link.download = `generated-image-${i + 1}.png`;
      link.click();
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Image Generator</h1>

      <textarea
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: "60px" }}
      />

      <select value={aspect} onChange={(e) => setAspect(e.target.value)}>
        {aspectPresets.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>

      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="cartoon">Cartoon</option>
        <option value="realistic">Realistic</option>
        <option value="anime">Anime</option>
        <option value="watercolor">Watercolor</option>
      </select>

      <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
        {[1, 2, 3, 4].map((n) => (
          <option key={n} value={n}>{n} image(s)</option>
        ))}
      </select>

      <button onClick={generateImage}>
        {loading ? "Generating..." : "Generate Image(s)"}
      </button>

      {images.length > 1 && (
        <button onClick={downloadAll}>Download All</button>
      )}

      <div>
        {images.map((img, i) => (
          <div key={i}>
            <img src={img} alt={`Generated ${i}`} style={{ width: "100%" }} />
            <button onClick={() => downloadImage(img, i)}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
