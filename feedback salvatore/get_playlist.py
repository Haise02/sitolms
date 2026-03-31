import urllib.request
import re

url = 'https://www.youtube.com/playlist?list=PL3m-0_KBDgVPvkTVU0Vr23c2c-PTvdw_k'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cookie': 'CONSENT=YES+1'
})
resp = urllib.request.urlopen(req).read().decode('utf-8')
ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', resp)
seen = list(dict.fromkeys(ids))
for v in seen:
    print(v)
