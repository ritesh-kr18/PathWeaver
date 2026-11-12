import wave, math, struct

def generate_tone(filename, freq, duration, volume=0.5, fade_out=True):
    sample_rate = 44100
    n_samples = int(sample_rate * duration)
    
    with wave.open(filename, 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sample_rate)
        
        for i in range(n_samples):
            # Calculate base sine wave
            value = math.sin(2.0 * math.pi * freq * (i / sample_rate))
            
            # Apply fade out if requested
            env = 1.0
            if fade_out:
                env = max(0, 1.0 - (i / n_samples))
                
            # Scale to 16-bit int
            sample = int(value * env * volume * 32767.0)
            data = struct.pack('<h', sample)
            w.writeframesraw(data)

# Generate a high, quick click sound
generate_tone('/Users/ritesh/Downloads/PathWeaver/client/public/assets/audio/click.wav', 800, 0.1)

# Generate a success chime (higher pitch, slightly longer)
generate_tone('/Users/ritesh/Downloads/PathWeaver/client/public/assets/audio/success.wav', 1200, 0.4)

print("Audio generated successfully.")
