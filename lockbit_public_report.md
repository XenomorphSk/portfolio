# Undocumented LockBit 4.0 Affiliates: Blockchain Forensics & Campaign Intelligence from the 2025 Panel Breach

**Author:** Gabriel Skura Ribeiro (@XenomorphSk)  
**Date:** July 2026  
**Research type:** Independent OSINT / blockchain forensics  
**Data source:** `github.com/Hexastrike/LockBit-Database-Leak-2025` (public dataset parsed from LockBit 4.0 panel breach, May 7, 2025 — authenticity confirmed by TRM Labs, Forescout, Trellix, Cisco Talos)

---

## Abstract

Following the May 2025 breach of LockBit 4.0's affiliate panel, several firms published analyses focusing on the five most active affiliates by message volume (Christopher, Swan, PiotrBond, JamesCraig, Lofikdis). This report documents **three affiliates that appear in no prior publication**, identified through independent blockchain forensics and dataset cross-correlation. Key findings include: three dormant BTC wallets with confirmed ransom proceeds; a previously undocumented Latin America campaign spanning nine countries with a consistent IAB-linked code; 69 confirmed ransomware attacks by a single affiliate in 81 days; and an attempted attack against a regulated Brazilian financial institution not disclosed in any public breach database.

All information derives exclusively from publicly available data. No unauthorized system access was performed. Intelligence pertaining to attribution identifiers and specific unnotified victim entities has been submitted to appropriate law enforcement channels and is omitted from this publication.

---

## Background

On May 7, 2025, an unknown actor breached LockBit 4.0's dark web affiliate panel and released a MySQL database dump (`paneldb_dump.zip`). The dataset covers December 2024 through April 2025 and includes 75 affiliate accounts, ~60,000 BTC addresses, 1,183 ransomware builds, and negotiation chat logs. Researchers at TRM Labs, Forescout/Vedere Labs, Trellix, Cisco Talos, and Yarix published analyses in May–June 2025, collectively focusing on a small subset of the most visible affiliates.

This research applied independent analysis to the complete dataset, focusing specifically on affiliates with confirmed on-chain activity that fell outside the scope of prior publications.

---

## Methodology

1. **Dataset acquisition:** Parsed CSV files from `github.com/Hexastrike/LockBit-Database-Leak-2025`
2. **Affiliate ranking:** Cross-referenced `lockbit-users.csv`, `lockbit-bitcoin-addresses.csv`, and `lockbit-files.csv` to rank all 35 affiliates with BTC addresses by victim count and address activity
3. **On-chain verification:** Queried `mempool.space` public API for all addresses belonging to affiliates outside the documented top-5
4. **Campaign correlation:** Extracted build filenames to identify geographic patterns, campaign codes, and victim slugs
5. **Cross-validation:** Compared findings against all published analyses to confirm novelty

Python scripts used are available in the companion repository.

---

## Findings

### 1. Three Active Wallets in Undocumented Affiliates

Of the 35 affiliates with BTC addresses in the dataset, only the top-5 previously documented affiliates had received verified on-chain funds — or so prior analyses suggested. This research found **three additional affiliates with confirmed wallet activity**, none of which appear in any prior publication:

| Affiliate handle | Wallet | Received (sats) | Status |
|---|---|---|---|
| umarbishop47 | `bc1qx3e4eslyzhclzr4y4yexw3jhyw5n4xe4vakgvt` | 7,191,141 | Dormant — never moved |
| ArrynBaird | `bc1qat80jxvlng5gpt2er5ghz42zrd4f3dv36zh5yd` | 1,906,015 | Dormant — never moved |
| btcdrugdealer | `bc1qkhmyzj4kswwhrkdrt3ww0v2cvqrzcgh2jvpt8q` | 465,493 | Dormant — never moved |

All three wallets received exactly one transaction and have never had outgoing activity. This matches the "parked admin funds" pattern documented by TRM Labs for administrator-controlled wallets — but applied here to affiliate wallets, suggesting these represent victim ransom payments that were never processed through the standard commission flow, possibly due to the panel breach interrupting operations in late April 2025.

---

### 2. The "n046" Campaign — Undocumented Latin America Operation

Analysis of the complete `lockbit-files.csv` table revealed that **umarbishop47** (panel advid=28, tagged "newbie") operated at a scale dramatically larger than the "newbie" classification suggests. Cross-referencing build filenames produced the following campaign map:

**Total builds by umarbishop47:** 53 (vs. approximately 8 visible in prior analyses)

**Campaign code "n046"** appears in 44 of 53 filenames, consistently formatted as `_n046_[country].zip`. This code does not appear in any threat intelligence publication, OSINT database, or prior research on the LockBit panel breach.

**Geographic distribution of n046 campaign:**

| Country | Confirmed victim count |
|---|---|
| Brazil | 8 |
| Mexico | 5 |
| Colombia | 2 |
| Argentina | 3 |
| Italy | 2 |
| Bolivia | 2 |
| Uruguay | 1 |
| Spain | 1 |

**Critical timing observation:** Six of the first n046 attacks all occurred within a single two-hour window on December 21, 2024, targeting companies in Argentina, Spain, Brazil (×2), Colombia, and Uruguay simultaneously. This pattern is inconsistent with manual victim selection and strongly suggests **batch purchase from an Initial Access Broker (IAB)** — a supplier who pre-compromises multiple corporate networks and sells access in labeled batches. The "n046" identifier may represent batch number 46 from this IAB's catalog.

**Secondary campaign "serebro"** (7 builds, targets in Italy and USA) appears to use a separate access source, with geographically distinct targeting inconsistent with the Latin America focus of n046. "Serebro" (сере́бро) means silver in Russian and may reference the IAB or access type.

**Publicly confirmed victims from n046 campaign** (already announced by LockBit on their leak site, per ransomware.live):
- NICATEL S.A. (Uruguay) — Samsung distributor, announced 2025-01-13
- ATP Formosa (Argentina) — provincial tax authority
- Gelco Gelatinas do Brasil (Brazil)
- Candelas y Asociados S.L. (Spain)
- Pasteurizadora La Mejor S.A. (Colombia)

The remaining 17+ n046 victims have not been publicly identified.

---

### 3. ArrynBaird — 13 Victims Including Undocumented macOS Attack

**ArrynBaird** (advid=13, tagged "newbie") conducted 13 confirmed attacks between January and April 2025, with ransom demands ranging from $10,000 to $200,000. The panel's `lockbit-files.csv` table shows build filenames with explicit ransom amounts embedded as operational notes.

Notable entry: a build with filename notation `mac_200k` created April 17, 2025 — indicating a macOS-targeted attack with a $200,000 ransom demand. macOS targeting is atypical for LockBit, which predominantly deploys Windows and ESXi variants. This specific incident does not appear in any ransomware incident database.

ArrynBaird also paid the panel access fee in **Monero** rather than Bitcoin (3.635 XMR), indicating higher operational security awareness than the other two affiliates in this analysis.

---

### 4. btcdrugdealer — 69 Victims in 81 Days

**btcdrugdealer** (advid=55, tagged **verified** — a trust level assigned by LockBit administrators to experienced affiliates) represents the most operationally active of the three documented affiliates.

**Operational tempo:**

| Metric | Value |
|---|---|
| Active period | 2025-02-02 to 2025-04-24 |
| Total days | 81 |
| Days with activity | 41 |
| Unique victims | 69 |
| Peak activity | 4 victims/day |
| Platforms | Windows (primary), Linux, ESXi (VMware) |

ESXi targeting is significant: attacks against VMware ESXi servers typically indicate access to enterprise virtualization infrastructure, where a single compromised host can encrypt dozens of virtual machines simultaneously.

**Notable exfiltrations identified from build notations:**

| Date | Volume | Platform |
|---|---|---|
| 2025-02-13 | 21 terabytes | Linux (LockBit Green) |
| 2025-02-04 | 4 terabytes | Windows |
| 2025-04-05 | "big_cloud" | Windows |

The 21TB exfiltration on February 13 represents the largest single data theft identified across all three affiliates in this dataset.

**Anomalous targeting — Iran:** One build from February 7, 2025 contains the notation `iran`, indicating an attack against an Iranian entity. LockBit's Terms of Service prohibit attacks against CIS countries but do not explicitly list Iran. Attacking Iran is atypical behavior for affiliates operating within Russian-aligned cybercrime ecosystems and may carry geopolitical significance beyond financial motivation.

**Undisclosed attempted attack on regulated financial institution:** An entry in the `lockbit-system-invalid-requests.csv` table — which captures failed or rate-limited panel operations — shows btcdrugdealer attempting to configure a ransomware build targeting a regulated foreign exchange brokerage with over 35 years of operation and 238 employees. The request was blocked by the panel's rate limiter on February 17, 2025. Whether the attack was subsequently deployed through other means is unknown. This entity does not appear in any public ransomware breach database. **[Entity name withheld pending notification to appropriate parties.]**

---

## Recruiter Network

Each of the three affiliates entered the LockBit panel through an invitation system. The `lockbit-invites.csv` table records the cryptocurrency wallets that received panel access fees:

| Affiliate | Payment coin | Recruiter wallet |
|---|---|---|
| umarbishop47 | BTC | `bc1qx7rra42tq05xtzr59recah8gmr0tsfc96hw9y8` |
| btcdrugdealer | BTC | `bc1qwfdwpn9yd7cvvxsv0hpvkejfcwpev0r355c5hh` |
| ArrynBaird | XMR | `83y9U4KwV1CSUbSgFW5BaPWCFZAnfNxXpV1b3Siac87E7R7KekYij9sMAhZtmLHtYXhEiZmSthGAoaiNbrD4voR72FDqGS6` |

Neither BTC recruiter wallet appears elsewhere in the dataset, indicating the recruiters are not themselves registered affiliates in the same panel — they likely operate at a higher tier within the LockBit ecosystem.

---

## Comparison with Prior Published Research

| Finding | TRM Labs (May 2025) | Forescout (Jun 2025) | This research |
|---|---|---|---|
| Top-5 affiliates profiled | ✓ | ✓ | ✓ (replicated) |
| umarbishop47 real scale (53 builds) | ✗ | Partial (20 builds analyzed) | **✓** |
| "n046" IAB campaign code | ✗ | ✗ | **✓ (novel)** |
| "serebro" secondary campaign | ✗ | ✗ | **✓ (novel)** |
| btcdrugdealer (69 victims) | ✗ | ✗ | **✓ (novel)** |
| ArrynBaird macOS $200k attack | ✗ | ✗ | **✓ (novel)** |
| 3 dormant affiliate wallets | ✗ | ✗ | **✓ (novel)** |
| Recruiter wallet identification | ✗ | ✗ | **✓ (novel)** |
| Undisclosed financial sector target | ✗ | ✗ | **✓ (withheld)** |

---

## Limitations

- The `chats` table is redacted in the public repository — negotiation content was not available for cross-correlation
- Wallet amounts are modest ($460–$7,200), suggesting partial payments or deposits rather than full ransom settlements
- Attribution to real-world identities is not possible from public data alone; on-chain analysis stops at exchange deposit addresses
- Victim identification is limited to slug patterns and publicly announced cases; many remain unidentified

---

## Responsible Disclosure

Attribution identifiers discovered during this research have been submitted to appropriate law enforcement channels. The undisclosed financial sector victim has been flagged for notification through appropriate channels. No victim data, private keys, or decryption material was accessed or is published here.

---

## Indicators of Compromise (Public)

**BTC wallets with ransom proceeds (all dormant):**
- `bc1qx3e4eslyzhclzr4y4yexw3jhyw5n4xe4vakgvt` (umarbishop47)
- `bc1qat80jxvlng5gpt2er5ghz42zrd4f3dv36zh5yd` (ArrynBaird)
- `bc1qkhmyzj4kswwhrkdrt3ww0v2cvqrzcgh2jvpt8q` (btcdrugdealer)

**Build description IDs (cross-reference with victim forensics):**
- `DB69CA22FDA4A9F7` (ArrynBaird, tokyoroki.com.mx)
- `E8CE7416FADFBF29` (umarbishop47, NICATEL Uruguay)
- `855954BF57A37DA4` (btcdrugdealer, komp.com)

**Campaign codes (for threat intel correlation):**
- `n046` — IAB batch campaign, Latin America / Iberian Peninsula, Dec 2024 – Apr 2025
- `serebro` — Secondary campaign, Italy / USA, Mar 2025

---

## References

1. TRM Labs, "LockBit Leak Provides Insight into RaaS Enterprise," May 2025
2. Forescout/Vedere Labs, "Ransomware Services Exposed," June 2025
3. Trellix, "Inside LockBit's Admin Panel Leak," June 2025
4. Cisco Talos, "Xoxo to Prague," May 2025
5. Hexastrike, LockBit-Database-Leak-2025 (GitHub), May 2025
6. ransomware.live — victim tracking database
7. mempool.space — Bitcoin blockchain explorer

---

*Independent security research. All data sourced from publicly available material. Submitted in good faith for the benefit of the security community and affected organizations.*
