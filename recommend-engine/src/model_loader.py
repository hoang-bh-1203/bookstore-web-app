import torch
import torch.nn as nn
from transformers import AutoModel, AutoTokenizer
import os


class SimCSEModel(nn.Module):
    """
    SimCSE model wrapper for Vietnamese sentence embeddings using PhoBERT.
    Uses mean pooling over the last hidden states.
    """

    def __init__(self, model_name, cache_dir=None):
        super(SimCSEModel, self).__init__()
        print(f"Initializing SimCSE model: {model_name}")
        self.encoder = AutoModel.from_pretrained(
            model_name, cache_dir=cache_dir, trust_remote_code=True
        )

    def forward(self, input_ids, attention_mask):
        """
        Forward pass with mean pooling.

        Args:
            input_ids: Token IDs from tokenizer
            attention_mask: Attention mask from tokenizer

        Returns:
            Mean-pooled sentence embeddings
        """
        outputs = self.encoder(input_ids=input_ids, attention_mask=attention_mask)

        # Mean Pooling - Take attention mask into account for correct averaging
        last_hidden_state = outputs.last_hidden_state
        input_mask_expanded = (
            attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float()
        )
        sum_embeddings = torch.sum(last_hidden_state * input_mask_expanded, 1)
        sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)

        return sum_embeddings / sum_mask


def load_model(config):
    """
    Load pretrained SimCSE-PhoBERT model for Vietnamese sentence embeddings.

    Args:
        config: Configuration object with MODEL_NAME, CACHE_DIR, and DEVICE

    Returns:
        Loaded model ready for inference
    """
    print(f"Loading pretrained model: {config.MODEL_NAME}")
    print(f"Cache directory: {config.CACHE_DIR}")

    # Ensure cache directory exists
    os.makedirs(config.CACHE_DIR, exist_ok=True)

    # Load pretrained model directly from HuggingFace
    model = SimCSEModel(config.MODEL_NAME, cache_dir=config.CACHE_DIR)

    # Move to device and set to evaluation mode
    model.to(config.DEVICE)
    model.eval()

    print(f"Model loaded successfully on {config.DEVICE}")

    return model


def load_tokenizer(config):
    """
    Load tokenizer for the model.

    Args:
        config: Configuration object with MODEL_NAME and CACHE_DIR

    Returns:
        Loaded tokenizer
    """
    print(f"Loading tokenizer: {config.MODEL_NAME}")
    tokenizer = AutoTokenizer.from_pretrained(
        config.MODEL_NAME, cache_dir=config.CACHE_DIR, trust_remote_code=True
    )
    print("Tokenizer loaded successfully")

    return tokenizer
