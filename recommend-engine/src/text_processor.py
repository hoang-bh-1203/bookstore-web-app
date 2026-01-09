import py_vncorenlp
import os
import re
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

    def clean_text(self, text):
        """
        Clean text by removing newlines, extra spaces, and special characters.

        Args:
            text: Raw text string

        Returns:
            Cleaned text string
        """
        if not text:
            return ""

        # Convert to string
        text = str(text)

        # Remove HTML tags if any
        text = re.sub(r"<[^>]+>", " ", text)

        # Replace newlines, tabs, and carriage returns with space
        text = text.replace("\n", " ").replace("\r", " ").replace("\t", " ")

        # Replace multiple spaces with single space
        text = re.sub(r"\s+", " ", text)

        # Remove leading/trailing whitespace
        text = text.strip()

        return text

    def segment(self, text):
        """
        Segment Vietnamese text using RDRSegmenter.

        Args:
            text: Text string to segment

        Returns:
            Segmented text string
        """
        if not text:
            return ""
        try:
            sentences = self.rdrsegmenter.word_segment(str(text))
            return " ".join(sentences)
        except Exception as e:
            print(f"Warning: Segmentation failed: {e}")
            return str(text)

    def prepare_input(self, row):
        """
        Prepare text input for embedding generation.
        Format: [Category] Description (cleaned, segmented, and truncated to 200 words)

        Args:
            row: Dictionary containing product data with 'category_name' and 'description'

        Returns:
            Formatted and segmented text string ready for embedding
        """
        # Get category name (try both field names for compatibility)
        cat = str(row.get("category_name") or row.get("category_names") or "Unknown")

        # Get description
        desc = str(row.get("description") or "")

        # 1. Clean the description (remove newlines, extra spaces, etc.)
        desc = self.clean_text(desc)

        # 2. Truncate to 200 words before segmentation for efficiency
        desc = " ".join(desc.split()[:200])

        # 3. Create formatted text with category
        formatted_text = f"[{cat}] {desc}"

        # 4. Segment the entire text using RDRSegmenter
        segmented_text = self.segment(formatted_text)

        return segmented_text
