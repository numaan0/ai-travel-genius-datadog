# Travel Genius

**AI-powered multi-agent travel planner with full observability using Datadog**

### Traffic Simulation

To test our detection rules, we used a traffic generator to simulate usage spikes and failures. This verified that our monitors (e.g. error rate, latency) would trip as expected.

---

## 🛡️ Traffic Generator Instructions

Quick guide to run traffic tests against the Travel Genius API.

### QUICK START

```bash
chmod +x traffic_generator.sh
./traffic_generator.sh
```

Runtime: approximately 20 seconds for 4 requests

### WHAT IT TESTS

The script tests 4 different travel scenarios:

* Tokyo, Japan - 1 day - ₹50,000 - Adventure type
* Dubai, UAE - 2 days - ₹150,000 - Luxury type
* Kyoto, Japan - 3 days - ₹80,000 - Cultural type
* Bangkok, Thailand - 2 days - ₹60,000 - Party type

### OUTPUT EXPLAINED

Successful Request shows:

```
✅ SUCCESS (3.2s)
📋 Trip: 🗾 Tokyo Adventure Escape
💵 Total Cost: 48500
📆 Days Planned: 1
🌱 Sustainability: 8.2/10
```

Failed Request shows:

```
❌ FAILED (5.1s)
💻 HTTP Code: 500
📄 Error: Internal Server Error
```

Final Statistics:

```
Total Requests: 4
✅ Successful: 4 (100.0%)
❌ Failed: 0 (0.0%)
⏱️ Average Time: 3.5s per request
```

### CUSTOMIZATION

* To test locally: change API base URL to `http://localhost:8000`

### TROUBLESHOOTING

| Problem              | Solution                                          |
| -------------------- | ------------------------------------------------- |
| Permission denied    | `chmod +x traffic_generator.sh`                 |
| All requests fail    | Check API health:`curl /health`                 |
| No traces in Datadog | Wait 1-2 mins or check `DD_API_KEY`in Cloud Run |
| Script hangs         | Ctrl+C to stop or increase curl timeout           |

### PERFORMANCE TARGETS

* Success Rate: Good ≥98%, Acceptable ≥95%, Poor <90%
* Latency: Good <4s, Acceptable <6s, Poor >10s
* Error Rate: Good <2%, Acceptable <5%, Poor >10%

### ADVANCED USAGE

* Save output:

```bash
./traffic_generator.sh | tee log_$(date +%Y%m%d_%H%M%S).txt
```

* Add to crontab for repeat testing:

```bash
*/10 * * * * /path/to/traffic_generator.sh >> /path/to/traffic.log
```

### REQUIREMENTS

* Bash
* curl
* Internet access

---

## ✨ Thanks

Built for the Datadog Hackathon 2025 with full trace-based observability.

**Organization name:** `ai-travel-genius`

License: MIT
