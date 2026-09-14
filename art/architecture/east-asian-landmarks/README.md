# East Asian landmark collection

Original procedural miniature meshes in `dist/east-asian-landmark-models.js`, rendered through the same depth rasterizer used by the playable city and gallery. Twelve PNGs show three buildings in four directions. These are three designs, not twelve independent buildings.

Architectural references:

- [Himeji Castle official history](https://www.himejicastle.jp/en/guide/history/): white plaster construction and a main keep with six interior floors above a basement. The model interprets the five exterior tiers, stone base, gables and a connected watchtower. It omits the full compound and interior structure.
- [National Palace Museum of Korea: Geunjeongjeon dedicatory writing](https://www.gogung.go.kr/gogungEn/pgm/psgudMng/view.do?menuNo=800065&psgudSn=372058): identifies Geunjeongjeon as Gyeongbokgung's main throne hall. The model interprets the double roof, red columns and stone terraces. The inventory's historical romanization “Kunjungjon” is mapped to Geunjeongjeon; exact original game composition remains unverified.
- [Chiang Kai-shek Memorial Hall: design concept](https://www.cksmh.gov.tw/en/cp.aspx?n=6330): identifies the octagonal roof and central memorial building. The model includes two blue roof tiers, a white body and ceremonial stairs, omitting the surrounding theater and concert hall. The source currently redirects to the institution's home page; its indexed design description was available during research.

All three lots are authored 4 × 4 reconstructions. Original game dimensions, sculpture inventories and exact proportions are not established by these references. No source image or proprietary game model was copied.

Regenerate with `node scripts/render-east-asian-landmarks.mjs` followed by `python3 scripts/assemble-east-asian-landmarks.py`. Generate and verify the playable exercise with `node scripts/create-east-asian-landmark-review.mjs`.
