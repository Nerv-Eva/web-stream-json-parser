// my event handler
function EventBus (all) {
    all = all || Object.create(null);

    return {
        on(type, handler) {
            if (typeof handler !== 'function') {
                throw new Error('Handler is not a function');
            }
            (all[type] || (all[type] = [])).push(handler);
        },
        off(type, handler) {
            if (all[type]) {
                all[type].splice(all[type].indexOf(handler) >>> 0, 1);
            }
        },
        emit(type, evt) {
            (all[type] || []).slice().map(handler => {
                handler(evt);
        });
            (all['*'] || []).slice().map(handler => {
                handler(type, evt);
        });
        }
    };
}

export default EventBus;