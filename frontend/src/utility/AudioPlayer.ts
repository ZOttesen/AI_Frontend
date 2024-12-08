export const audioService = (() => {
    const baseUrl = 'http://localhost:8080';
    let audioPlayer: HTMLAudioElement | null = null;

    const playAudio = (relativePath: string): void => {
        console.log('Playing audio:', relativePath);
        const fullUrl = `${baseUrl}${relativePath}`;

        if (audioPlayer) {
            stopAudio();
        }

        audioPlayer = new Audio(fullUrl);

        audioPlayer.play()
            .then(() => {
                console.log('Audio is playing:', fullUrl);
            })
            .catch((error) => {
                console.error('Error playing audio:', error);
            });

        audioPlayer.onended = () => {
            console.log('Audio has finished playing.');
        };
    };

    // Stop afspilning
    const stopAudio = (): void => {
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0; // Nulstil til start
            audioPlayer = null;
            console.log('Audio stopped.');
        }
    };

    return {
        playAudio,
        stopAudio,
    };
})();
