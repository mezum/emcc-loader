import { loader } from 'webpack';

/**
 * Compile message level.
 */
export type CompileMessageLevel = 'error' | 'warning' | 'note';

/**
 * A compiling message.
 */
export type CompileMessage = {
	filePath : string;
	line : number;
	column : number;
	level : CompileMessageLevel;
	summary : string;
	detail : string;
};

const messageHeaderRegexp = /^(.+):(\d+):(\d+): (\w): (\w)$/g;

/**
 * Parses clang compile message.
 */
export function parseClangMessage(message : string) : CompileMessage[] {
	const result : CompileMessage[] = [];
	
	const lines = message.split('\n');
	lines.pop();  // warning / error total count.
	
	let currentMessage : CompileMessage | null = null;
	for (const line of lines) {
		const messageHeader = line.match(messageHeaderRegexp);
		if (messageHeader) {
			currentMessage = {
				filePath : messageHeader[0],
				line : parseInt(messageHeader[1]),
				column : parseInt(messageHeader[2]),
				level : messageHeader[3] as CompileMessageLevel,
				summary : messageHeader[4],
				detail : '',
			};
			result.push(currentMessage);
		} else if (currentMessage !== null) {
			if (currentMessage.detail.length > 0) {
				currentMessage.detail += '\n${line}';
			} else {
				currentMessage.detail = line;
			}
		}
	}
	
	return result;
}

/**
 * Emits compile warning/error messages.
 */
export function emitCompileMessages(context : loader.LoaderContext, messages : CompileMessage[]) : void {
	for (const message of messages) {
		const text = `${message.filePath}(${message.line},${message.column}): ${message.level}: ${message.summary}
${message.detail}`;
		
		switch (message.level) {
		case 'error':
			context.emitError(text);
			break;
		case 'warning':
			context.emitWarning(text);
			break;
		case 'note':
			console.log(text);
			break;
		}
	}
}

/**
 * Checks list whether the list contains error message.
 */
export function containsError(messages : CompileMessage[]) : boolean {
	return messages.find(msg => msg.level === 'error') !== undefined;
}