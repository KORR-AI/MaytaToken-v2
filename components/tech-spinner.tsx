"use client"

export default function TechSpinner() {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative w-64 h-64">
        {/* Digital circuit background */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 overflow-hidden">
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="w-full h-full opacity-20">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 h-px bg-cyan-500/50"
                  style={{
                    width: "100%",
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  }}
                />
              ))}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 rounded-full border border-cyan-500/30"
                  style={{
                    width: `${(i + 1) * 25}%`,
                    height: `${(i + 1) * 25}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rotating outer ring with data points */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(6, 182, 212, 0.7) 0%, rgba(6, 182, 212, 0.1) 20%, rgba(6, 182, 212, 0) 30%)",
            animation: "spin 4s linear infinite",
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 30}deg) translateX(32px) rotate(-${i * 30}deg)`,
                boxShadow: "0 0 8px rgba(6, 182, 212, 0.8)",
              }}
            />
          ))}
        </div>

        {/* Middle rotating ring with analytical segments */}
        <div
          className="absolute inset-8 rounded-full overflow-hidden"
          style={{
            animation: "spin 8s linear infinite reverse",
          }}
        >
          <div className="w-full h-full relative">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-0 w-1/2 h-1/2"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  transformOrigin: "bottom right",
                  background:
                    i % 2 === 0
                      ? "linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0))"
                      : "linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(236, 72, 153, 0))",
                }}
              />
            ))}
          </div>
        </div>

        {/* Inner rotating ring with data visualization */}
        <div
          className="absolute inset-16 rounded-full border-2 border-pink-500/30 overflow-hidden"
          style={{
            animation: "spin 6s linear infinite",
          }}
        >
          <div className="absolute inset-0 bg-black/60">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-pink-500/70"
                style={{
                  height: `${Math.random() * 70 + 30}%`,
                  width: "6.25%",
                  left: `${i * 6.25}%`,
                  opacity: 0.7,
                  animation: `pulse ${1 + Math.random() * 2}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Center core with pulsing effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-black/80 rounded-full flex items-center justify-center border border-cyan-500/50">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/80 flex items-center justify-center text-white font-mono text-xl">
                <div className="animate-pulse">
                  <span className="text-cyan-400">0</span>
                  <span className="text-pink-400">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orbiting data points */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "10s" }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "15s", animationDelay: "1s" }}>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "12s", animationDelay: "2s" }}>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full shadow-lg shadow-pink-500/50"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "8s", animationDelay: "3s" }}>
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
        </div>

        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute h-px w-full bg-cyan-400/70 blur-[1px]"
            style={{
              animation: "scanline 2s linear infinite",
              boxShadow: "0 0 8px rgba(6, 182, 212, 0.8)",
            }}
          ></div>
        </div>

        {/* Add keyframes for the animations */}
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.3; }
          }
          @keyframes scanline {
            0% { top: -5%; }
            100% { top: 105%; }
          }
        `}</style>
      </div>
    </div>
  )
}
