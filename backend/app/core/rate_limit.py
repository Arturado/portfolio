import time
from collections import defaultdict
from threading import Lock

# En memoria: alcanza para un solo proceso backend (single-admin, VPS
# propio). Si en el futuro se corre con multiples workers/replicas, esto
# deja de ser confiable y hay que pasar a Redis.
WINDOW_SECONDS = 10 * 60
MAX_REQUESTS = 3

_hits: dict[str, list[float]] = defaultdict(list)
_lock = Lock()


def is_rate_limited(key: str) -> bool:
    now = time.monotonic()
    with _lock:
        hits = [t for t in _hits[key] if now - t < WINDOW_SECONDS]
        if len(hits) >= MAX_REQUESTS:
            _hits[key] = hits
            return True
        hits.append(now)
        _hits[key] = hits
        return False
