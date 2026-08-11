export interface Product {
  id: string;
  name: string;
  description: string;
  priceEur: number;
  priceAr: number;
  image: string;
  needs?: string[];
  categories?: string[];
}

export const products: Product[] = [
  {
    id: "ricin-bio",
    name: "Huile de Ricin Bio",
    description: "Croissance & Brillance",
    priceEur: 18.00,
    priceAr: 22500,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvgtiPAotBsJ5lIXVowHRIIQeibW5ThW-foK9PrWxVdEpLTjuNmMQzMMLzJ44FOlAGZ996WB4PSUcs0BjdasG3sZnY780M_aw1afUbIeakQcK2ONjIkwLQapsB99KaMrhA3YwLjgzIgGYptwP-ahDOyDxnvYrt15VCl3Wmy14MqWMhh4kb0W0N-eB4hZ22N_rsm9bJJY9lYJq8RhTTqf1qnj5OD9O9lHdqtGOcolq_PUMB7oNHXIQ8",
    needs: ["Hydratation Profonde"],
    categories: ["Huiles & Sérums"]
  },
  {
    id: "coco-mask",
    name: "Masque Hydratant Coco",
    description: "Nutrition Profonde",
    priceEur: 24.50,
    priceAr: 30000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSKeUBf5co-4W8nxdIoTHXSRO67vzCxCVVglGuuHNh_AUook2m-2WKUd9dZVUbnSfprQcYJXrxn4DuEKQ8ppSrv-Ed2TD9HH7UwwnRjEIou-hbvMgfbqaDiEIF_kZIgLxpy6Gtppsh4njiLQ33gwVxUqBx6NkW92f8gjsYsYJ5KkGGpz2cz-jaL2zM6H27WS3ZwxSWxZV3RirULg2tq77wW7_opJGCF5qB8CVGj85AePe9EWC9EnmB",
    needs: ["Hydratation Profonde"],
    categories: ["Soins & Masques"]
  },
  {
    id: "brume-fresh",
    name: "Brume Rafraîchissante",
    description: "Hydratation Quotidienne",
    priceEur: 16.00,
    priceAr: 20000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0NR27VlJL1ZCmFSt8rC9OT9OHp4IEQdNTo3JRJRE4x0IIM316eG83oekQqDEt6hRnM8P-1v_Bu0qm-Lqxjy2K9WhrgQIFRWQsONZavWDLsh4sB2iEM7r6KrMuOORcLYkki7KIrtnXHrS-IqiUAY-fmm6EFHUFTm9DYLtaiiYih9xhwpDmWdQAAphEX79AxNfbD7yH7XLLIxTAYPJ27DhEw_lnsBFLLv9wlOPBb1zARcsEVcgIodof",
    needs: ["Hydratation Profonde"],
    categories: ["Soins & Masques"]
  },
  {
    id: "serum-baobab",
    name: "Sérum Pousse Baobab",
    description: "Force & Densité",
    priceEur: 28.00,
    priceAr: 35000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB4WjC_R8uUpGvbDR-uP-67mBK2N3xkZD3k3VOSbYfguLh8wjft_hwf_miXJLsi69_nrVb4WAoJIcIsqFgqVsYMw5HVt756bRe7o_8_rft1JhN8LZXcLur_8zHWilAJGdP41dCc1UYWTDscgfRuVCPH_b8IwCOVAIQrTEWZRri2Ew8JR05ilsa79b4QcbVTZIIVegfAgob_Chcs-ITqqy3mSDzXIdiElhtnS0z8nooJqTZX6UPUdMf",
    needs: ["Volume & Densité"],
    categories: ["Huiles & Sérums"]
  },
  {
    id: "serum-revitalize",
    name: "Huile Sérum Revitalisante",
    description: "Cheveux crépus et frisés",
    priceEur: 32.00,
    priceAr: 40000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHyjJPDma_VU2N-UtkbEIuFJKf6On_qaRUxZkRSebixf9-83K9CQ2DR7hRdmtkGNnhYJ81eGa-S79r1b-F99XB7YsJTg6Ae4l7ayB6lc91rufTjk8ruYsnC8ke3AkneNj1rq4vGmfTiVoxE-MmOjJso6gV0l7krVdBQsyKw3zojh6llIHMpESC29mtxG1qnyNjK2YkAleHXnjMOZtTPKMzeJkk7MY_abePBKy95Gqx1s0tp82Z5djP",
    needs: ["Volume & Densité", "Hydratation Profonde"],
    categories: ["Huiles & Sérums"]
  },
  {
    id: "mask-intense",
    name: "Masque Hydratation Intense",
    description: "Tous types de boucles",
    priceEur: 28.00,
    priceAr: 35000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOiSxrdrxgPT0JKa0mfiIaPVhlvFXv8_TLl6njXgUeh949djCDj8dmd3iwlQlM_mtN4GFtg5A5xDm9nFEvUHQ-d4lyk1JV5Nu7odPPjN7phrsor0msPm4zgxMmfAMVT09Tdblxm5wx57Xcz_k7P72O4gCivkqKICLxCSH3AWoBY4VS8gc9UgLA8-p6e3URQkByMh9v4TkZOOxh7YXCnyuZ1qKZhaoJQqlpkPVXqB8A1TUaffjJMh70",
    needs: ["Hydratation Profonde", "Définition des Boucles"],
    categories: ["Soins & Masques"]
  },
  {
    id: "creme-lavante",
    name: "Crème Lavante Douce",
    description: "Soin quotidien",
    priceEur: 24.00,
    priceAr: 30000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuByTek5XCT00mZPzkpOnToatx9X6Z9cPiduJpCgochmMXSdO3OIEx7NZ393SAsmMpGEBd_pDlMvGyHJPmipIC5XmWq_99k0O4w5HAnJcGScTN501e9yCVaNxXWfIh_3yScp0lE6qA8DHMZbzEXLP3P5s3Ao51qWrz54sWUU5L5hf27XQyb4MUhRBFVVF7Rrmmx8IriAcrFuy2aQs99QvAu-H7yqAv4vOpb5v676XsslhVMJ-AJYU5yE",
    needs: ["Définition des Boucles"],
    categories: ["Shampoings & Lavants"]
  },
  {
    id: "peigne-bois",
    name: "Peigne en Bois de Santal",
    description: "Accessoires Démêlage",
    priceEur: 18.00,
    priceAr: 22500,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJlnx2Q4rCp891b2homf1_pPxuNCK0VCCDT6WYSMFC8tcZi-laW_cOpqCVvazoyRcc6AltRLyIAxfGNCbo0EhMDDUGOeRpdqs_a6X7veNQVp8hWq8lQbr5-w5gjRm-NcuRimD1bgQGxSuzvR7kbEqwnMLf1fWqwrH6Y5ajka4ZJqVNWRY8pnwAltVOsy3Sgx4U_EyB4HyA9kgQ2TuxCbFFd5cItPvs_E8Kv7WupYVwiTSYM2bOECuG",
    needs: ["Définition des Boucles"],
    categories: ["Accessoires"]
  },
  {
    id: "ricin-botanique",
    name: "Huile de Ricin Botanique",
    description: "Soin fortifiant - 100ml",
    priceEur: 24.00,
    priceAr: 30000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL5tuk9vuqpS7KOVY5NnMO9HjP_0FRgP6XMIkF9Ii2Q_sHBu5uN08pP176JJqFnFccA5ofwvi4pdYkCZZgZbV_ETcgbhZUKpjdF0KJfrsuhMHbLn_tcpCxLnZCSkxW9j6BF57rdwEzlja14F0T6lYB8D9MM4Gu9Y8BtPPdXj6TkDiGclIPPhSbGVp3kfrXMmN6GFBejvXe2JdBYIufBfwPsafSDR0PMQyTq-ylAnuydyjccPAT8PCY",
    needs: ["Hydratation Profonde"],
    categories: ["Huiles & Sérums"]
  },
  {
    id: "mask-profonde",
    name: "Masque Hydratation Profonde",
    description: "Cheveux secs à très secs - 250g",
    priceEur: 32.00,
    priceAr: 40000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5Gg46fVpxSEdRrxjts08qhJspnNeZlWZfw28jqJ_vLcA6wGILkCSThLKK53B0rKV2QpwkztGsK3-69EQEPIYXTrMu7QubMrOlzR5gS11gb02wGHJcLvoRJetIBuXXfmf-_LSqNzrxeaSvVAkJ9-moVY2b7Iu51rwjSc0eX0Z3x0lfPsy0_lzYhiAuDG62h1dkKJPWXOEc4c2JU_THQmWMWTB8uyZwH1s4KFVreIPZKecHmaZQ8T4G",
    needs: ["Hydratation Profonde"],
    categories: ["Soins & Masques"]
  },
  {
    id: "hibiscus-cream",
    name: "Crème d'Hibiscus Nourrissante",
    description: "Cheveux crépus",
    priceEur: 36.00,
    priceAr: 45000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoP0xlBGbOAYu2ETS5ySx_8T4gX65UmJkysDowuLT5qEuxVQfkM33csppEcJB-myhcG5MNegeEABO2Qpm2xCPKWLx_f78tJ2MhllXbk_hDT3BJh1r4jkqZsWgjYhkKfTRhWaXYQnZroIXn1FIvU2neJ8LKbvU8OEfpeq-nF3o2i2z06FcvHHQBQp-t4FFR0YlYst1PH301QLPUdR30gLbhOF8TrF4jbVNJwDtjCCSDpbXJQGAWaSzJ",
    needs: ["Hydratation Profonde", "Définition des Boucles"],
    categories: ["Soins & Masques"]
  }
];
