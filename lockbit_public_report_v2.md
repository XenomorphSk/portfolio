# Undocumented LockBit 4.0 Affiliates & IAB Attribution: Blockchain Forensics and Campaign Intelligence from the 2025 Panel Breach

**Author:** Gabriel Skura Ribeiro (@XenomorphSk)  
**Date:** July 2026  
**Research type:** Independent OSINT / blockchain forensics / threat intelligence  
**Data sources:** `github.com/Hexastrike/LockBit-Database-Leak-2025` (public dataset, LockBit 4.0 panel breach May 7, 2025) · ransomware.live · mempool.space · Forescout/Vedere Labs public research

---

## Abstract

Following the May 2025 breach of LockBit 4.0's affiliate panel, several firms published analyses of the five most active affiliates by message volume. This report documents three affiliates absent from all prior publications, and extends the investigation to identify the likely Initial Access Broker (IAB) supplying batch access to one of them. Key findings include: three dormant BTC wallets with confirmed ransom proceeds; a previously undocumented coordinated Latin American campaign spanning nine countries with a consistent batch-purchase code; 69 confirmed attacks by a single affiliate in 81 days; and a hypothesis connecting the IAB behind the campaign to Mora_001, a Fortinet-exploitation threat actor with confirmed LockBit ecosystem ties.

All data derived exclusively from public sources. Attribution identifiers and specific unnotified victim entities have been submitted to appropriate law enforcement channels and are omitted from this publication.

---

## Background

On May 7, 2025, an unknown actor breached LockBit 4.0's dark web affiliate panel and released the MySQL backend as a public dump. The dataset covers December 2024 through April 2025 and includes 75 affiliate accounts, approximately 60,000 BTC addresses, 1,183 ransomware builds, and negotiation metadata. Analyses by TRM Labs, Forescout/Vedere Labs, Trellix, Cisco Talos, and Yarix in May–June 2025 collectively focused on the five most visible affiliates out of 44 that actually conducted attacks.

This research applied systematic analysis to the complete dataset: ranking all 35 affiliates with BTC addresses by victim count, verifying on-chain activity for every address outside the documented top-5, and extracting full campaign maps from build filenames.

---

## Methodology

1. Ranked all affiliates with BTC addresses by victim count using cross-reference of `lockbit-users.csv`, `lockbit-bitcoin-addresses.csv`, and `lockbit-files.csv`
2. Queried mempool.space public API for all addresses belonging to affiliates outside the documented top-5
3. Extracted build filenames to identify geographic patterns, campaign codes, and victim slugs
4. Cross-referenced findings against ransomware.live and public LockBit leak site announcements to confirm victim identities
5. Correlated campaign timing and victim profiles against published threat intelligence on known IAB actors

Python scripts available in the companion repository.

---

## Finding 1 — Three Active Wallets in Undocumented Affiliates

Of 35 affiliates with BTC addresses in the dataset, prior analyses documented wallet activity only in the top-5. This research identified three additional affiliates with confirmed on-chain activity — all absent from any prior publication:

| Affiliate | Wallet | Received (sats) | Status |
|---|---|---|---|
| umarbishop47 | `bc1qx3e4eslyzhclzr4y4yexw3jhyw5n4xe4vakgvt` | 7,191,141 | Dormant — never moved |
| ArrynBaird | `bc1qat80jxvlng5gpt2er5ghz42zrd4f3dv36zh5yd` | 1,906,015 | Dormant — never moved |
| btcdrugdealer | `bc1qkhmyzj4kswwhrkdrt3ww0v2cvqrzcgh2jvpt8q` | 465,493 | Dormant — never moved |

Each wallet received exactly one incoming transaction and has had zero outgoing activity — consistent with funds parked before the May 2025 breach disrupted operations.

---

## Finding 2 — The "n046" Campaign: Undocumented Coordinated IAB Operation

Analysis of `lockbit-files.csv` revealed that umarbishop47 (panel advid=28, tagged "newbie") operated at dramatically larger scale than the classification suggests: 53 total builds, compared to approximately 8 visible in prior analyses.

More significantly, 44 of those 53 builds share the consistent filename pattern `_n046_[country].zip` — a campaign code that does not appear in any published threat intelligence report.

### Critical timing observation

The first six n046 attacks were all created within a **40-minute window on December 21, 2024** (15:00–15:39 UTC), targeting companies in five different countries simultaneously:

| Time (UTC) | Company | Country |
|---|---|---|
| 15:00 | ATP Formosa (provincial tax authority) | Argentina |
| 15:11 | Candelas y Asociados S.L. | Spain |
| 15:16 | Gelco Gelatinas do Brasil Ltda | Brazil |
| 15:19 | Viação Jacareí (JACAREI TRANSPORTE URBANO LTDA) | Brazil |
| 15:31 | Pasteurizadora La Mejor S.A. | Colombia |
| 15:39 | NICATEL S.A. (Samsung distributor) | Uruguay |

Compromising six companies across five countries in 40 minutes is operationally impossible without pre-purchased access. This is the forensic signature of an IAB batch sale: access to these networks was obtained in advance, packaged, and delivered to umarbishop47 as a single purchase. The code "n046" is the IAB's batch identifier — batch number 46, implying a sustained operation with at least 45 prior batches.

### Full campaign geography

Subsequent n046 waves continued through April 2025, extending to Mexico, Italy, and Bolivia:

| Country | Confirmed victims |
|---|---|
| Brazil | 8 |
| Mexico | 5 |
| Argentina | 3 |
| Colombia | 2 |
| Italy | 2 |
| Bolivia | 2 |
| Uruguay | 1 |
| Spain | 1 |

Total publicly confirmed from the campaign: 9 companies. Dataset contains evidence of 13 additional unidentified victims.

A secondary campaign code "serebro" (Russian/Slavic for silver) appears in 7 builds targeting Italy and the USA — likely a separate access source or distinct batch from the same IAB.

---

## Finding 3 — IAB Attribution Hypothesis: Mora_001

The n046 campaign profile correlates strongly with **Mora_001**, a threat actor documented by Forescout/Vedere Labs in March 2025 exploiting Fortinet FortiOS authentication bypass vulnerabilities.

### Evidence of connection

| Factor | n046 campaign | Mora_001 (Forescout, March 2025) |
|---|---|---|
| Timing | Batch 1 deployed December 21, 2024 | CVE-2024-55591 exploited as zero-day since November 2024 |
| Victim profile | Mid-size LatAm/Iberian companies, multi-sector | Organizations with exposed FortiGate management interfaces |
| Attack pattern | 6 companies in 5 countries in 40 minutes | Automated scripts probe multiple targets simultaneously |
| LockBit connection | Confirmed LockBit 4.0 affiliate | TOX ID in SuperBlack ransom notes previously linked to LockBit 3.0 |
| Geographic focus | Latin America + Iberian Peninsula | Highest FortiGate exposure: USA, India, Brazil (3,201 exposed at time of research) |

### The vulnerability

CVE-2024-55591 is a critical authentication bypass in FortiOS/FortiProxy (CVSS 9.6) that allows unauthenticated attackers to gain `super_admin` privileges on exposed management interfaces. Forescout confirmed exploitation since November 2024 — six weeks before the n046 first batch — with Mora_001 using automated scripting to scan and compromise targets rapidly.

This matches the n046 model: an actor with FortiGate access harvested via mass CVE-2024-55591 exploitation sells batches of credentials to LockBit affiliates. The "n046" label is the batch number.

### Infrastructure (from Forescout public report)

Mora_001 operates servers on **ASN48282 (VDSINA, Moscow, Russia)**, with confirmed activity from the `185.147.124.0/24` range. A VPN connection originating from IP `89.248.192.55` was geolocated to Russia in victim FortiGate logs. IP `185.147.124.34` was observed running a Russian-language VPN brute-force tool on port 7000.

Post-exploitation usernames created consistently across all Mora_001 victims: `forticloud-tech`, `fortigate-firewall`, `adnimistrator` (intentional misspelling).

**Verification method for law enforcement:** checking logs of n046 victims for these usernames would confirm or deny the IAB connection.

### Confidence assessment

This is a **strong hypothesis** supported by timing, victim profile, operational method, and ecosystem overlap — but not a confirmed attribution. Forescout has not published any direct connection between Mora_001 and the n046 campaign code. Confirmation requires log analysis from n046 victims or legal process to Mora_001's hosting provider.

---

## Finding 4 — ArrynBaird: 13 Victims Including Undocumented macOS Attack

ArrynBaird (advid=13, tagged "newbie") conducted 13 confirmed attacks between January and April 2025, with ransom demands ranging from $10,000 to $200,000. One build contains the notation `mac_200k` — a macOS-targeted attack with a $200,000 demand, created April 17, 2025. macOS targeting is atypical for LockBit; this incident does not appear in any public ransomware database.

ArrynBaird paid panel access via **Monero** rather than Bitcoin, indicating higher operational security awareness than the other two affiliates.

---

## Finding 5 — btcdrugdealer: 69 Victims in 81 Days

btcdrugdealer (advid=55, tagged **verified** — an admin-assigned trust level) is the most operationally active of the three:

| Metric | Value |
|---|---|
| Active period | February 2 – April 24, 2025 |
| Unique victims | 69 |
| Peak activity | 4 victims/day |
| Platforms | Windows, Linux, ESXi (VMware) |
| Countries | USA, Canada, UK, Colombia, Brazil, and others |

Notable exfiltrations from build file notations: 21 terabytes (single Linux attack, February 13) and 4 terabytes (February 4). ESXi targeting indicates attacks on enterprise virtualization infrastructure, where a single compromised host can encrypt dozens of virtual machines.

One build targets an Iranian entity — unusual behavior for a LockBit affiliate, since Russian-aligned operators typically avoid Iran. This may indicate non-Russian origin, geopolitical motivation beyond financial gain, or independent ideological stance.

---

## Comparison with Prior Research

| Finding | TRM Labs (May 2025) | Forescout (Jun 2025) | This research |
|---|---|---|---|
| Top-5 affiliates documented | ✓ | ✓ | ✓ |
| umarbishop47 real scale (53 builds) | ✗ | Partial | **✓** |
| n046 IAB campaign code | ✗ | ✗ | **✓ (novel)** |
| serebro secondary campaign | ✗ | ✗ | **✓ (novel)** |
| btcdrugdealer (69 victims) | ✗ | ✗ | **✓ (novel)** |
| ArrynBaird macOS $200k attack | ✗ | ✗ | **✓ (novel)** |
| 3 dormant affiliate wallets | ✗ | ✗ | **✓ (novel)** |
| n046 / Mora_001 IAB hypothesis | ✗ | ✗ | **✓ (novel)** |
| Recruiter wallet identification | ✗ | ✗ | **✓ (novel)** |

---

## Limitations

- The `chats` table in the public repository is redacted — negotiation content was unavailable
- Wallet amounts ($460–$7,200) suggest partial payments or deposits rather than full ransom settlements
- The Mora_001/n046 IAB connection is a hypothesis based on correlation, not confirmed attribution
- Real-world identity attribution is not achievable from public data alone

---

## Responsible Disclosure

Attribution identifiers discovered during this research have been submitted to appropriate law enforcement channels via official FBI tip submission (July 2026). Two unnotified potential victims have been flagged through appropriate channels. No victim data, private keys, or decryption material was accessed or is published here.

---

## Public Indicators of Compromise

**BTC wallets with confirmed ransom proceeds (all dormant):**
```
bc1qx3e4eslyzhclzr4y4yexw3jhyw5n4xe4vakgvt  (umarbishop47)
bc1qat80jxvlng5gpt2er5ghz42zrd4f3dv36zh5yd  (ArrynBaird)
bc1qkhmyzj4kswwhrkdrt3ww0v2cvqrzcgh2jvpt8q  (btcdrugdealer)
```

**Campaign codes (for threat intel cross-referencing):**
```
n046    — IAB batch campaign, Latin America / Iberian Peninsula, Dec 2024 – Apr 2025
serebro — Secondary campaign, Italy / USA, Mar 2025
```

**Build description IDs:**
```
E8CE7416FADFBF29  (umarbishop47 / NICATEL Uruguay)
DB69CA22FDA4A9F7  (ArrynBaird / tokyoroki.com.mx)
855954BF57A37DA4  (btcdrugdealer / komp.com)
```

---

## References

1. TRM Labs — "LockBit Leak Provides Insight into RaaS Enterprise," May 2025
2. Forescout/Vedere Labs — "New Ransomware Operator Exploits Fortinet Vulnerability Duo," March 2025
3. Forescout/Vedere Labs — "Ransomware Services Exposed," June 2025
4. Trellix — "Inside LockBit's Admin Panel Leak," June 2025
5. Cisco Talos — "Xoxo to Prague," May 2025
6. Hexastrike — LockBit-Database-Leak-2025, github.com/Hexastrike/LockBit-Database-Leak-2025
7. ransomware.live — victim tracking database
8. mempool.space — Bitcoin blockchain explorer

---

*Independent security research. All data from publicly available material. Submitted in good faith for the benefit of the security community and affected organizations.*
