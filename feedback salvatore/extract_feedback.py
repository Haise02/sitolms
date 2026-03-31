from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.texts = []
    def handle_data(self, data):
        t = data.strip()
        if t:
            self.texts.append(t)

p = TextExtractor()
with open(r'c:\Users\nilga\Desktop\Import\SIto LMS\feedback salvatore\CopiadiFeedbackSitoLMS30Marzo2026.html', 'r', encoding='utf-8') as f:
    p.feed(f.read())

for line in p.texts:
    print(line)
