import {fetchDocument, updateDoc, deleteFields} from "../util/Firestore";
import Result from "../dto/Result";


export const addTags = async (user: string, tags: Array<string>) => {
	console.log('attempting to add', tags, 'to', user);
	const mappedTags = mapIncomingTags(tags);
	return await updateDoc(`tags/${user}`, mappedTags);
};
export const addNewTags = async (user:string, tags: Array<string>) => {
	const customTags = await fetchCustomTags(user);
	if(!customTags.success) return customTags;
	const newTags = tags.filter(tag => customTags.data.indexOf(tag) === -1);
	if (newTags.length > 0) return await addTags(user, newTags);
	return null;
};
export const addTag = async (user: string, tag: string) => await addTags(user, [tag]);
export const removeTags = async (user: string, tags: Array<string>) => {
	console.log('attempting to remove tags', tags, 'from user', user);
	return await deleteFields(`tags/${user}`, tags);
};
const mapIncomingTags = (tags: Array<string>): Object => {
	const tagObj = {};
	tags.forEach(tag => tagObj[tag] = true);
	return tagObj;
};
const fetchCustomTags = async (user: string) => {
	console.log('fetching custom tags for user', user);
	const tagResult: Result = await fetchDocument(`tags/${user}`);
	console.log('custom tage result', tagResult);
	if (!tagResult.success) return tagResult;
	console.log('custom tag fetch was successful');
	delete tagResult.data[0].id;
	tagResult.data = Object.keys(tagResult.data[0]);
	return tagResult;
};
const fetchPublicTags = async (user: string) => {
	console.log('fetching custom tags for user', user);
	const tagResult: Result = await fetchDocument('tags/public');
	console.log('public tag result', tagResult);
	if (!tagResult.success) return tagResult;
	console.log('public tag fetch was successful');
	delete tagResult.data[0].id;
	tagResult.data = Object.keys(tagResult.data[0]);
	return tagResult;
};

export const fetchTags = async (user: string) => {
	console.log('fetching all tags for user', user);
	const publicTagPromise = fetchPublicTags(user);
	const customTagPromise = fetchCustomTags(user);
	const publicResult = await publicTagPromise;
	console.log('public result', publicResult);
	const customResult = await customTagPromise;
	console.log('public result', customResult);
	if (!publicResult.success) return publicResult;
	if (!customResult.success) return customResult;
	return new Result(
		true,
		[{
			public: publicResult.data,
			custom: customResult.data
		}]
	);
};

