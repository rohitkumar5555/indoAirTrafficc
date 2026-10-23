import React from 'react';
import { Copy, Check, Video, Github, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export function HackathonDocsView() {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl space-y-8">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Devpost Submission Guide & Video Pitch Script</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Exact details for the "Additional Info" page, GitHub instructions, and a 2-minute recording script for your video demo.
        </p>
      </div>

      {/* Additional Info Page Fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono text-xs">
          1. Answers for Current Devpost Screen ("Additional Info")
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Track Selection */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="font-semibold text-emerald-400 block mb-1">
                Field 1: Which Primary Track(s) are you submitting into?
              </span>
              <p className="text-slate-400 text-[11px] mb-3">
                Devpost dropdown me yeh select karein:
              </p>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-white text-xs">
                Machine Learning/AI <span className="text-slate-500">and/or</span> Productivity
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3">
              Drone fleet optimization directly aligns with ML algorithms and autonomous logistics productivity.
            </p>
          </div>

          {/* GitHub Repository URL */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-emerald-400">
                  Field 2: Provide a URL to your code repository on GitHub
                </span>
                <button
                  onClick={() => copyToClipboard('https://github.com/rohitkr00/indoairtraffic', 'github')}
                  className="cursor-pointer text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedSection === 'github' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'github' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Apna GitHub repository URL paste karein:
              </p>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-300 text-xs">
                https://github.com/rohitkr00/indoairtraffic
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3">
              Open source MIT License file (LICENSE) aur README.md already generate ho chuki hain!
            </p>
          </div>

          {/* New or Existing Project */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between md:col-span-2">
            <div>
              <span className="font-semibold text-emerald-400 block mb-1">
                Field 3: Is your project new or existing prior to August 31, 2026?
              </span>
              <p className="text-slate-400 text-[11px] mb-2">
                Dropdown me kya select karna hai:
              </p>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-300 font-bold text-xs inline-block">
                New project
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              <strong className="text-white">Note:</strong> "New project" select karne se aapko neeche ka lamba "explanation" box nahi bharna padega, aur judges ko pata chalega ki aapne yeh hackathon ke dauran fresh banaya hai!
            </p>
          </div>
        </div>
      </div>

      {/* Video Script */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" />
            <span>2. Video Demo Script (2 Minutes Recording Guide)</span>
          </h3>
          <button
            onClick={() => copyToClipboard(`IndoAirTraffic Demo Script:
0:00 - 0:20: Hello everyone, this is IndoAirTraffic. With autonomous drone deliveries like Amazon Prime Air scaling up, low-altitude airspace under 400 ft is getting congested. Drones face two major risks: mid-air collisions and battery death due to unexpected headwinds and heavy parcels.
0:20 - 0:50: IndoAirTraffic provides a deterministic 4D Air Traffic Control and EcoRoute system. Here on the screen is our live Airspace Radar. We stratify airspace into altitude corridors: green for inbound deliveries between 250-320 feet, and cyan for return flights between 330-400 feet.
0:50 - 1:20: When two drones encounter a trajectory conflict within a 60-meter safety envelope, our automated CD&R engine immediately executes a micro-altitude shift of 35 feet, avoiding collision without halting missions.
1:20 - 1:45: In our Battery EcoRoute Lab, instead of a straight-line GPS path that wastes power fighting headwinds, our 3D aerodynamic engine routes along wind-assisted corridors, saving up to 18.4% battery while guaranteeing a 20% safe landing reserve.
1:45 - 2:00: IndoAirTraffic ensures safe, energy-efficient, and scalable urban skies for commercial drone delivery. Thank you!`, 'script')}
            className="cursor-pointer text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg"
          >
            {copiedSection === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'script' ? 'Copied Script' : 'Copy Script'}</span>
          </button>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
          <div>
            <strong className="text-cyan-400 font-mono block mb-0.5">[0:00 - 0:25] Introduction & The Problem</strong>
            <p>
              "Hello everyone! This is IndoAirTraffic. With autonomous drone delivery networks like Amazon Prime Air scaling rapidly, low-altitude airspace under 400 feet is facing serious safety risks: mid-air collisions, and unpredictable battery exhaustion caused by headwinds and heavy parcel payloads."
            </p>
          </div>

          <div>
            <strong className="text-cyan-400 font-mono block mb-0.5">[0:25 - 0:55] Live Radar & Stratified Corridors</strong>
            <p>
              "Here is our live IndoAirTraffic Airspace Radar. We assign dedicated altitude corridors: 250 to 320 feet for inbound delivery drones, and 330 to 400 feet for outbound return drones. Each aircraft maintains a 60-meter dynamic safety separation bubble."
            </p>
          </div>

          <div>
            <strong className="text-cyan-400 font-mono block mb-0.5">[0:55 - 1:30] Conflict Deconfliction Demo</strong>
            <p>
              "Watch what happens when we simulate a 4D trajectory conflict. The system instantly detects the converging flight paths in under 50 milliseconds, alerts the dispatcher, and executes an automated 35-foot altitude offset to safely deconflict the aircraft."
            </p>
          </div>

          <div>
            <strong className="text-cyan-400 font-mono block mb-0.5">[1:30 - 2:00] Battery EcoRoute Lab & Wrap-Up</strong>
            <p>
              "In our EcoRoute Optimizer, rather than following a straight GPS line that wastes energy fighting headwinds, our aerodynamic physics engine routes around wind resistance, saving up to 18.4% battery while guaranteeing a 20% emergency landing reserve. IndoAirTraffic makes urban drone airspace safe, predictable, and highly efficient. Thank you!"
            </p>
          </div>
        </div>
      </div>

      {/* GitHub Push Instructions */}
      <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>3. Code GitHub Par Kaise Daalein (Quick Terminal Commands)</span>
        </h3>
        <p className="text-slate-400">
          Agar aap apne laptop par GitHub me code push karna chahte hain, toh apne local terminal me yeh 4 commands run kar sakte hain:
        </p>
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 space-y-1">
          <div>git init</div>
          <div>git add .</div>
          <div>git commit -m "feat: complete IndoAirTraffic UTM & battery optimization engine"</div>
          <div>git branch -M main</div>
          <div>git remote add origin https://github.com/rohitkr00/indoairtraffic.git</div>
          <div>git push -u origin main</div>
        </div>
      </div>
    </div>
  );
}
