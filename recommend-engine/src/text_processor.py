import py_vncorenlp
import os
from .config import Config


class TextProcessor:
    def __init__(self):
        if not os.path.exists(Config.SEGMENTER_DIR):
            os.makedirs(Config.SEGMENTER_DIR, exist_ok=True)
            py_vncorenlp.download_model(save_dir=Config.SEGMENTER_DIR)

        # Only load word segmenter (annotators must be a list)
        self.rdrsegmenter = py_vncorenlp.VnCoreNLP(
            save_dir=Config.SEGMENTER_DIR, annotators=["wseg"]
        )

    def segment(self, text):
        if not text:
            return ""
        try:
            sentences = self.rdrsegmenter.word_segment(str(text))
            return " ".join(sentences)
        except:
            return str(text)

    def prepare_input(self, row):
        """Format: [Category] Description (truncated to 200 words)"""
        cat = str(row.get("category_names") or "Unknown")
        desc = str(row.get("description") or "")

        # Truncate description to 200 words
        desc = " ".join(desc.split()[:200])
        return f"[{cat}] {desc}"
