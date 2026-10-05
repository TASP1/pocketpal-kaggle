# KaggleCapabilityBar

Drop-in chip row for **Web · Think · Shell** flags on Kaggle Bridge model ids.

## Integration (chat header or above ChatInput)

```tsx
import {KaggleCapabilityBar} from '../components/KaggleCapabilityBar';
import {modelStore, serverStore} from '../store';

// Inside an observer component, when the active model is remote + Kaggle:
const binding = modelStore.activeRemoteBinding; // or your equivalent
const server = serverStore.servers.find(s => s.id === binding?.serverId);
const isKaggle = server?.serverType === 'Kaggle Bridge';

{isKaggle && binding && (
  <KaggleCapabilityBar
    modelId={binding.remoteModelId}
    visible
    disabled={isStreaming}
    onModelIdChange={next => {
      // Re-select / update the remote model id on the session binding
      modelStore.setRemoteModelId?.(next);
      // or: modelStore.selectModel({ ...binding, remoteModelId: next })
    }}
  />
)}
```

Wire `onModelIdChange` to whatever API your fork uses to update the live
`RemoteSessionBinding.remoteModelId` so the next `OpenAICompletionEngine`
request uses the flagged id. Streaming continues to use the existing
`streamChatCompletion` path — no transport changes required.
