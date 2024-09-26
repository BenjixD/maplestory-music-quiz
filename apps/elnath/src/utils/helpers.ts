export function WrapMsgAsCodeBlock(msg: string): string {
	return "```ini\n" + msg + "\n```";
}

export async function Delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

