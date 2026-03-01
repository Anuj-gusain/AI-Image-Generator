import { useState } from "react";
import { Download, Loader2, Sparkles, Image as ImageIcon, Wand2 } from "lucide-react";
import Navbar from "../components/Navbar";

interface GeneratedImage {
  _id: string;
  imageUrl: string;
  prompt: string;
}

const Generate = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/images/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setImages((prev) => [data, ...prev]);
      setPrompt("");
    } catch (error) {
      console.error(error);
      alert("Image generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pixelforge-${image._id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-primary" />
            Create Something Amazing
          </h1>
          <p className="text-muted-foreground mb-6">
            Describe the image you want to generate
          </p>

          <form onSubmit={handleGenerate} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
                placeholder="A mystical forest with glowing mushrooms at twilight..."
                disabled={isGenerating}
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Your Creations
          </h2>

          {images.length === 0 ? (
            <div className="text-center py-20 glass rounded-xl">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No images yet. Start by typing a prompt above!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {images.map((image) => (
                <div
                  key={image._id}
                 className="group relative rounded-2xl overflow-hidden border border-border bg-card transition-all duration-300 p-3"
                >
                  <div className="w-full h-[520px] overflow-hidden rounded-2xl">
                   <img
                   src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                              />
                   </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-foreground text-sm font-medium mb-3">
                      {image.prompt}
                    </p>

                    <button
                      onClick={() => handleDownload(image)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all w-fit"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Generate;