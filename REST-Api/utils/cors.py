from flask import make_response, Response
from functools import wraps

def build_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

def build_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response



def exception_to_response(func):
    @wraps(func)
    def _exc_to_resp_decorator(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except Exception as e:
            return self.api.handle_error(e)

    return _exc_to_resp_decorator


def cross_origin(origin="*"):
    def cross_origin(func):
        @wraps(func)
        def _decoration(*args, **kwargs):
            ret = func(*args, **kwargs)
            _cross_origin_header = {"Access-Control-Allow-Origin": origin,
                                    "Access-Control-Allow-Headers":
                                        "Origin, X-Requested-With, Content-Type, Accept"}
            if isinstance(ret, tuple):
                if len(ret) == 2 and isinstance(ret[0], dict) and isinstance(ret[1], int):
                    # this is for handle response like: ```{'status': 1, "data":"ok"}, 200```
                    return ret[0], ret[1], _cross_origin_header
                elif isinstance(ret, str):
                    response = make_response(ret)
                    response.headers["Access-Control-Allow-Origin"] = origin
                    response.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept"
                    return response
                elif isinstance(ret, Response):
                    ret.headers["Access-Control-Allow-Origin"] = origin
                    ret.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept"
                    return ret
                else:
                    raise ValueError("Cannot handle cross origin, because the return value is not matched!")
            return ret

        return _decoration

    return cross_origin