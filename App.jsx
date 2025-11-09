
import React, { useMemo, useState } from "react";

// Clutch-a-Bling demo single-file component
const COLORS = [
  "Black","Gold","Silver","Red","Blue","Green","Champagne","Pink","White","Beige",
];

function generateBags(count = 300) {
  const bags = [];
  for (let i = 1; i <= count; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const price = Math.round((Math.random() * 450) + 30); // RM 30 - RM 480
    const brand = ["Designer Inspired", "Premium", "Classic", "Statement"][Math.floor(Math.random() * 4)];
    const size = ["Mini", "Small", "Medium", "Large"][Math.floor(Math.random() * 4)];
    bags.push({
      id: i,
      name: `${brand} Evening Bag #${String(i).padStart(3, "0")}`,
      color,
      price,
      size,
      brand,
      description: `Elegant ${color.toLowerCase()} ${size.toLowerCase()} evening bag. Great for weddings, parties and formal events.`,
      image: `https://picsum.photos/seed/clutch${i}/600/400`,
      available: Math.random() > 0.05,
      createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 180),
    });
  }
  return bags;
}

export default function App() {
  const [bags] = useState(() => generateBags(300));
  const [query, setQuery] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;
  const [selectedBag, setSelectedBag] = useState(null);

  const minPrice = 0;
  const maxPrice = 600;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bags
      .filter(b => (q === "" || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)))
      .filter(b => (selectedColors.length === 0 || selectedColors.includes(b.color)))
      .filter(b => (b.price >= priceRange[0] && b.price <= priceRange[1]))
      .sort((a, b) => {
        if (sortBy === "priceAsc") return a.price - b.price;
        if (sortBy === "priceDesc") return b.price - a.price;
        return b.createdAt - a.createdAt;
      });
  }, [bags, query, selectedColors, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleColor(color) {
    setCurrentPage(1);
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  }

  function onPriceChange(which, value) {
    setCurrentPage(1);
    setPriceRange(prev => which === "min" ? [Number(value), prev[1]] : [prev[0], Number(value)]);
  }

  function resetFilters() {
    setQuery("");
    setSelectedColors([]);
    setPriceRange([minPrice, maxPrice]);
    setSortBy("newest");
    setCurrentPage(1);
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 style={{margin:0}}>Clutch-a-Bling — Evening Bag Rental</h1>
          <div className="small">Over 300 evening bags available to rent • Seksyen 13, Shah Alam</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div className="small">Pickup: Seksyen 13, Shah Alam</div>
          <div className="small">WhatsApp: +60 1X-XXX XXXX (replace with your number)</div>
        </div>
      </header>

      <main style={{display:"grid", gridTemplateColumns:"320px 1fr", gap:20, marginTop:20}}>
        <aside className="filters">
          <h3 style={{marginTop:0}}>Search & Filters</h3>
          <div style={{marginTop:8}}>
            <label className="small">Search</label>
            <input value={query} onChange={e => { setCurrentPage(1); setQuery(e.target.value); }} placeholder="Search by name or description" style={{width:"100%", padding:8, marginTop:6, borderRadius:6, border:"1px solid #e6e9ee"}}/>
          </div>

          <div style={{marginTop:12}}>
            <label className="small">Color</label>
            <div style={{display:"flex", flexWrap:"wrap", gap:8, marginTop:8}}>
              {COLORS.map(c => (
                <button key={c} onClick={() => toggleColor(c)} className="btn" style={{border:selectedColors.includes(c) ? "2px solid #111" : "1px solid #e6e9ee"}}>{c}</button>
              ))}
            </div>
            <div className="small" style={{marginTop:8}}>Selected: {selectedColors.length || 'All'}</div>
          </div>

          <div style={{marginTop:12}}>
            <label className="small">Price range (RM)</label>
            <div style={{display:"flex", gap:8, marginTop:8}}>
              <input type="number" min={minPrice} max={maxPrice} value={priceRange[0]} onChange={e => onPriceChange('min', e.target.value)} style={{width:"50%", padding:8, borderRadius:6, border:"1px solid #e6e9ee"}} />
              <input type="number" min={minPrice} max={maxPrice} value={priceRange[1]} onChange={e => onPriceChange('max', e.target.value)} style={{width:"50%", padding:8, borderRadius:6, border:"1px solid #e6e9ee"}} />
            </div>
            <div className="small" style={{marginTop:8}}>Showing RM{priceRange[0]} — RM{priceRange[1]}</div>
          </div>

          <div style={{marginTop:12}}>
            <label className="small">Sort</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{width:"100%", padding:8, marginTop:6, borderRadius:6, border:"1px solid #e6e9ee"}}>
              <option value="newest">Newest arrivals</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
            </select>
          </div>

          <div style={{marginTop:14, display:"flex", gap:8}}>
            <button onClick={resetFilters} className="btn">Reset</button>
            <button onClick={() => { setSelectedBag(null); setCurrentPage(1); }} className="btn btn-primary">Clear</button>
          </div>

          <div style={{marginTop:14}}>
            <h4 style={{marginBottom:6}}>Pickup & Payment</h4>
            <div className="small">Location: <strong>Seksyen 13, Shah Alam</strong></div>
            <div className="small" style={{marginTop:6}}>Pickup by appointment only — timeslot provided after payment confirmation.</div>
            <div className="small" style={{marginTop:8}}>Payment methods (examples): Bank transfer (Maybank/CIMB), eWallets (TnG, GrabPay), PayPal, Cash on pickup (by arrangement).</div>
            <div className="small" style={{marginTop:8, color:"#b91c1c"}}>Replace placeholders with your real account details before publishing.</div>
          </div>
        </aside>

        <section className="gallery">
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <h3 style={{margin:0}}>Available Bags</h3>
              <div className="small">{filtered.length} results — page {currentPage} of {totalPages}</div>
            </div>
            <div className="small">Per page: 24</div>
          </div>

          <div style={{marginTop:12}} className="grid">
            {pageItems.map(b => (
              <div key={b.id} className="card">
                <img src={b.image} alt={b.name} />
                <div style={{padding:10}}>
                  <div style={{fontWeight:600}}>{b.name}</div>
                  <div className="small">{b.brand} • {b.size}</div>
                  <div style={{marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div style={{fontWeight:700}}>RM{b.price}</div>
                    <div><button onClick={() => setSelectedBag(b)} className="btn">Details</button></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:12, display:"flex", justifyContent:"center", gap:8}}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="btn">Prev</button>
            <div className="small">{currentPage} / {totalPages}</div>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="btn">Next</button>
          </div>

          <div style={{marginTop:16, background:"#fafafa", padding:12, borderRadius:8}}>
            <h4 style={{marginTop:0}}>How to rent</h4>
            <ol style={{marginTop:6}}>
              <li className="small">Browse and select a bag. Click <strong>Details</strong>, choose rental dates and confirm availability.</li>
              <li className="small">Make payment using one of the methods listed. Save the payment receipt.</li>
              <li className="small">Send receipt and preferred pickup times via WhatsApp to the contact number in the header.</li>
              <li className="small">Collect the bag at Seksyen 13, Shah Alam at the agreed timeslot. Return on agreed date.</li>
            </ol>

            <div style={{marginTop:10, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
              <div>
                <div style={{fontWeight:600}}>Notes</div>
                <ul style={{marginTop:6}}>
                  <li className="small">Security deposit may be required.</li>
                  <li className="small">Late returns may incur fees.</li>
                  <li className="small">Cleaning fee may apply for heavy stains.</li>
                </ul>
              </div>

              <div style={{background:"#fff", padding:10, borderRadius:6}}>
                <div style={{fontWeight:600}}>Contact & Pickup</div>
                <div className="small" style={{marginTop:8}}>Address: Seksyen 13, Shah Alam, Selangor, Malaysia</div>
                <div className="small" style={{marginTop:6}}>WhatsApp: <strong>+60 1X-XXX XXXX</strong> (replace with real number)</div>
                <div className="small" style={{marginTop:6}}>Provide bag name/ID, pickup date/time, and proof of payment.</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {selectedBag && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:60}}>
          <div style={{width:"90%", maxWidth:900, background:"#fff", borderRadius:8, overflow:"hidden"}}>
            <div style={{display:"flex", gap:12, padding:16}}>
              <div style={{flex:"0 0 50%"}}>
                <img src={selectedBag.image} alt={selectedBag.name} style={{width:"100%", height:320, objectFit:"cover", borderRadius:6}} />
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"start"}}>
                  <div>
                    <h3 style={{margin:0}}>{selectedBag.name}</h3>
                    <div className="small">{selectedBag.brand} • {selectedBag.size} • {selectedBag.color}</div>
                  </div>
                  <button onClick={() => setSelectedBag(null)} className="btn">Close</button>
                </div>

                <p className="small" style={{marginTop:10}}>{selectedBag.description}</p>
                <div style={{marginTop:10, display:"flex", gap:12, alignItems:"center"}}>
                  <div style={{fontWeight:800, fontSize:20}}>RM{selectedBag.price}</div>
                  <div className="small">Status: {selectedBag.available ? 'Available' : 'Not available'}</div>
                </div>

                <div style={{marginTop:12, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                  <div>
                    <label className="small">Rental start</label>
                    <input type="date" style={{width:"100%", padding:8, borderRadius:6, border:"1px solid #e6e9ee", marginTop:6}} />
                  </div>
                  <div>
                    <label className="small">Rental end</label>
                    <input type="date" style={{width:"100%", padding:8, borderRadius:6, border:"1px solid #e6e9ee", marginTop:6}} />
                  </div>
                </div>

                <div style={{marginTop:12, display:"flex", gap:8}}>
                  <button onClick={() => alert('Proceed to booking flow (replace with real booking)')} className="btn btn-primary">Book & Pay</button>
                  <button onClick={() => alert('Open WhatsApp or contact form (replace with real behavior)')} className="btn">Contact via WhatsApp</button>
                </div>

                <div className="small" style={{marginTop:8}}>Tip: Replace alerts with real booking & payment integration (payment gateway or admin confirmation flow).</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer style={{marginTop:20, textAlign:"center", padding:12, color:"#6b7280"}}>
        © {new Date().getFullYear()} Clutch-a-Bling — Seksyen 13, Shah Alam. Replace placeholder payment/contact details before publishing.
      </footer>
    </div>
  );
}
