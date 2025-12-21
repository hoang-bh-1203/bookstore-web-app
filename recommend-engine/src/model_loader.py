import torch
import torch.nn as nn
from transformers import AutoModel, AutoConfig
import os


class SimCSEModel(nn.Module):
    def __init__(self, model_name, cache_dir=None):
        super(SimCSEModel, self).__init__()
        config = AutoConfig.from_pretrained(model_name, cache_dir=cache_dir)
        self.encoder = AutoModel.from_pretrained(
            model_name, config=config, cache_dir=cache_dir
        )

    def forward(self, input_ids, attention_mask):
        outputs = self.encoder(input_ids=input_ids, attention_mask=attention_mask)
        # Mean Pooling
        last_hidden_state = outputs.last_hidden_state
        input_mask_expanded = (
            attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float()
        )
        sum_embeddings = torch.sum(last_hidden_state * input_mask_expanded, 1)
        sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
        return sum_embeddings / sum_mask


def load_model(config):
    print(f"Loading pretrained PhoBERT model: {config.MODEL_NAME}")
    print(f"Cache directory: {config.CACHE_DIR}")
    os.makedirs(config.CACHE_DIR, exist_ok=True)
    model = SimCSEModel(config.MODEL_NAME, cache_dir=config.CACHE_DIR)

    # Check if custom fine-tuned weights exist
    model_path = getattr(config, "MODEL_PATH", None)
    if model_path and os.path.exists(model_path):
        print(f"Loading fine-tuned weights from {model_path}...")
        state_dict = torch.load(model_path, map_location=config.DEVICE)
        model.load_state_dict(state_dict)
        print("Fine-tuned weights loaded successfully.")
    else:
        print("Using pretrained PhoBERT weights.")

    model.to(config.DEVICE)
    model.eval()
    return model
