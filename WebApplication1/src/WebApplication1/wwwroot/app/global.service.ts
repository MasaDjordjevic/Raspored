import {Injectable} from "angular2/core";

@Injectable()
export class GlobalService {

    renameProperty(object: Object, oldName: string, newName: string): Object {
        // Do nothing if the names are the same
        if (oldName == newName) {
            return this;
        }
        // Check for the old property name to avoid a ReferenceError in strict mode.
        if (object.hasOwnProperty(oldName)) {
            object[newName] = object[oldName];
            delete object[oldName];
        }
        return object;
    };

}

