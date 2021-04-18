class AuthorizationFailed(Exception):
    def __init__(self, reason):
        self.message = f"Authorization failed: {reason}"
        super().__init__(self.message)